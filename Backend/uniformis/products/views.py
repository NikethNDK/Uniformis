from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.db.models import Count, Avg
from .models import Category, Product, Review, Offer, ProductImage, Size
from .serializers import (
    CategorySerializer, ProductSerializer, SizeSerializer,
    ReviewSerializer, ProductDetailSerializer
)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser]

class SizeViewSet(viewsets.ModelViewSet):
    queryset = Size.objects.all()
    serializer_class = SizeSerializer
    permission_classes = [permissions.IsAdminUser]

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductSerializer

    @action(detail=False, methods=['GET'])
    def best_sellers(self, request):
        best_sellers = Product.objects.annotate(
            order_count=Count('orderitem')
        ).order_by('-order_count')[:8]
        serializer = self.get_serializer(best_sellers, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'])
    def offers(self, request):
        products_with_offers = Product.objects.filter(
            offer__isnull=False
        ).order_by('-offer__discount_percentage')[:8]
        serializer = self.get_serializer(products_with_offers, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['POST'])
    def update_stock(self, request, pk=None):
        if not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        product = self.get_object()
        new_stock = request.data.get('stock_quantity')
        if new_stock is not None:
            product.stock_quantity = new_stock
            product.save()
            return Response({'status': 'stock updated'})
        return Response({'error': 'stock_quantity required'}, 
                       status=status.HTTP_400_BAD_REQUEST)

    def perform_destroy(self, instance):
        # Override destroy to perform soft delete
        instance.is_active = False
        instance.save()

    @action(detail=True, methods=['POST'])
    def restore(self, request, pk=None):
        """Restore a soft-deleted product"""
        if not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        product = self.get_object()
        product.is_active = True
        product.save()
        return Response({'status': 'product restored'})

    @action(detail=True, methods=['DELETE'])
    def delete_image(self, request, pk=None):
        if not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        image_id = request.data.get('image_id')
        if not image_id:
            return Response({'error': 'image_id required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            image = ProductImage.objects.get(id=image_id, product_id=pk)
            image.delete()
            return Response({'status': 'image deleted'})
        except ProductImage.DoesNotExist:
            return Response({'error': 'Image not found'}, status=status.HTTP_404_NOT_FOUND)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if 'images' in request.FILES:
            for image in request.FILES.getlist('images'):
                ProductImage.objects.create(product=instance, image=image)

        return Response(serializer.data)

@api_view(['POST'])
def add_product(request):
    try:
        # Prepare the product data
        product_data = {
            'name': request.data.get('title'),
            'price': request.data.get('price'),
            'category_id': request.data.get('category'),  # Changed to category_id
            'description': request.data.get('description'),
            'stock_quantity': request.data.get('stock'),
            'size_ids': request.data.getlist('sizes')  # Get sizes as list
        }
       
        product_serializer = ProductSerializer(data=product_data)
        if product_serializer.is_valid():
            # Save the product
            product = product_serializer.save()
            
            # Handle images separately
            images = request.FILES.getlist('images')
            for image in images:
                ProductImage.objects.create(product=product, image=image)
            
            return Response(product_serializer.data, status=status.HTTP_201_CREATED)
        return Response(product_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', 'PUT', 'DELETE'])
def product_detail(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ProductSerializer(product)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ProductSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        product.soft_delete()
        return Response({'message': 'Product successfully deleted'}, status=status.HTTP_200_OK)

@api_view(['GET'])
def product_list(request):
    products = Product.objects.filter(is_deleted=False)
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

