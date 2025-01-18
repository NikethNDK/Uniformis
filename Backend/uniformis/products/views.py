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
    

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# @api_view(['POST'])
# def add_product(request):
#     try:
#         category_id = request.data.get('category')
#         print(category_id)
#         if not category_id:
#             return Response({"error": "Category is required"}, status=status.HTTP_400_BAD_REQUEST)

#         product_data = {
#             'name': request.data.get('title'),
#             'price': request.data.get('price'),
#             'category': category_id,
#             'description': request.data.get('description'),
#             'stock_quantity': request.data.get('stock')
#         }
       
#         product_serializer = ProductSerializer(data=product_data)
#         if product_serializer.is_valid():
#             product = product_serializer.save()
            
#             # Handle sizes
#             sizes = request.data.get('sizes', [])
#             product.sizes.set(sizes)
            
#             # Handle images
#             images = request.FILES.getlist('images')
#             for image in images:
#                 ProductImage.objects.create(product=product, image=image)
            
#             return Response(product_serializer.data, status=status.HTTP_201_CREATED)
#         return Response(product_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     except Exception as e:
#         return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
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
    
@api_view(['PUT'])
def update_product(request, pk):
    try:
        product = Product.objects.get(pk=pk)
        
        # Prepare the product data
        product_data = {
            'name': request.data.get('title'),
            'price': request.data.get('price'),
            'category_id': request.data.get('category'),
            'description': request.data.get('description'),
            'stock_quantity': request.data.get('stock'),
            'size_ids': request.data.getlist('sizes')
        }
        
        product_serializer = ProductSerializer(product, data=product_data, partial=True)
        if product_serializer.is_valid():
            product = product_serializer.save()
            
            # Handle images if new ones are uploaded
            if 'images' in request.FILES:
                images = request.FILES.getlist('images')
                for image in images:
                    ProductImage.objects.create(product=product, image=image)
            
            return Response(product_serializer.data)
        return Response(product_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)