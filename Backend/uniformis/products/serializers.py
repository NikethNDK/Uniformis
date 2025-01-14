from rest_framework import serializers
from .models import Category, Product, ProductVariant, Review, Offer,ProductImage

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'is_active']

class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ['id', 'variant', 'variant_price', 'stock']

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user_name', 'rating', 'comment', 'created_at']
        read_only_fields = ['user']

class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = ['id', 'discount_percentage']

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image']

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'category', 'name', 'description',
            'price', 'stock_quantity', 'images'
        ]
        

class ProductDetailSerializer(ProductSerializer):
    variants = ProductVariantSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    offer = OfferSerializer(read_only=True)

    class Meta(ProductSerializer.Meta):
        fields = ProductSerializer.Meta.fields + ['variants', 'reviews', 'offer']
