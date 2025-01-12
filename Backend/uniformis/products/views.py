# views.py
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Avg
from .models import Category, Product, ProductVariant, Review, Offer
from .serializers import (
    CategorySerializer, ProductSerializer, ProductVariantSerializer,
    ReviewSerializer, ProductDetailSerializer
)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductSerializer

    @action(detail=False, methods=['GET'])
    def best_sellers(self, request):
        # Get best selling products based on order count
        best_sellers = Product.objects.annotate(
            order_count=Count('orderitem')
        ).order_by('-order_count')[:8]  # 2 rows of 4 products
        serializer = self.get_serializer(best_sellers, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'])
    def offers(self, request):
        # Get products with active offers
        products_with_offers = Product.objects.filter(
            offer__isnull=False
        ).order_by('-offer__discount_percentage')[:8]  # 2 rows of 4 products
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

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)