from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CategoryViewSet, ReviewViewSet, add_product,SizeViewSet,update_product

# Create a router instance
router = DefaultRouter()

# Register the viewsets
router.register(r'items', ProductViewSet, basename='product')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'size',SizeViewSet,basename='size')

# Define the urlpatterns
urlpatterns = [
    path('addproduct/', add_product, name='add-product'),
    path('updateproduct/<int:pk>/', update_product, name='update-product'),
    path('', include(router.urls)),  # Include the router-generated URLs
]
