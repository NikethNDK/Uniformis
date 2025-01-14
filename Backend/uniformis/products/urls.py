from django.urls import path
from .views import *

product_list = ProductViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

product_detail = ProductViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

best_sellers = ProductViewSet.as_view({
    'get': 'best_sellers'
})

offers = ProductViewSet.as_view({
    'get': 'offers'
})

update_stock = ProductViewSet.as_view({
    'post': 'update_stock'
})

category_list = CategoryViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

category_detail = CategoryViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

review_list = ReviewViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

review_detail = ReviewViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

urlpatterns = [
    path('addproduct/', add_product, name='add-product'),
    path('items/', product_list, name='product-list'),
    path('items/<int:pk>/', product_detail, name='product-detail'),
    path('items/best_sellers/', best_sellers, name='product-best-sellers'),
    path('items/offers/', offers, name='product-offers'),
    path('items/<int:pk>/update_stock/', update_stock, name='product-update-stock'),
    path('categories/', category_list, name='category-list'),
    path('categories/<int:pk>/', category_detail, name='category-detail'),
    path('reviews/', review_list, name='review-list'),
    path('reviews/<int:pk>/', review_detail, name='review-detail'),
]
