from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Rating

User = get_user_model()

class RatingSerializer(serializers.ModelSerializer):
    rater = serializers.CharField(source="rater.username", read_only=True)
    ratee = serializers.CharField(source="ratee.username", read_only=True)

    class Meta:
        model = Rating
        fields = ["id", "for_role", "score", "comment", "rater", "ratee", "created_at"]

class RatingCreateSerializer(serializers.ModelSerializer):
    # client supplies ratee_id
    ratee_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Rating
        fields = ["ratee_id", "for_role", "score", "comment"]

    def create(self, validated_data):
        request = self.context["request"]
        ratee = User.objects.get(id=validated_data.pop("ratee_id"))
        return Rating.objects.create(rater=request.user, ratee=ratee, **validated_data)
