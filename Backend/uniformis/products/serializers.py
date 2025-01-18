from rest_framework import serializers
from .models import Category, Product, Review, Offer, ProductImage, Size

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'is_active']

class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = ['id', 'name']

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

# class ProductSerializer(serializers.ModelSerializer):
#     images = ProductImageSerializer(many=True, read_only=True)
#     category = CategorySerializer()
#     sizes = SizeSerializer(many=True, read_only=True)

#     class Meta:
#         model = Product
#         fields = [
#             'id', 'category', 'name', 'description',
#             'price', 'stock_quantity', 'images', 'sizes'
#         ]

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.IntegerField(write_only=True)  # For writing category
    sizes = SizeSerializer(many=True, read_only=True)
    size_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )  # For writing sizes

    class Meta:
        model = Product
        fields = [
            'id', 'category', 'category_id', 'name', 'description',
            'price', 'stock_quantity', 'images', 'sizes', 'size_ids'
        ]

    def create(self, validated_data):
        # Pop size_ids since it's not a direct field on Product model
        size_ids = validated_data.pop('size_ids', [])
        # Remove category_id from validated data after using it
        category_id = validated_data.pop('category_id')
        # Add category back to validated data
        validated_data['category_id'] = category_id
        
        # Create the product
        product = super().create(validated_data)
        
        # Add sizes if provided
        if size_ids:
            product.sizes.set(size_ids)
        
        return product

    def update(self, instance, validated_data):
        # Pop size_ids since it's not a direct field on Product model
        size_ids = validated_data.pop('size_ids', None)
        
        # Update the product
        product = super().update(instance, validated_data)
        
        # Update sizes if provided
        if size_ids is not None:
            product.sizes.set(size_ids)
        
        return product

class ProductDetailSerializer(ProductSerializer):
    reviews = ReviewSerializer(many=True, read_only=True)
    offer = OfferSerializer(read_only=True)

    class Meta(ProductSerializer.Meta):
        fields = ProductSerializer.Meta.fields + ['reviews', 'offer']

