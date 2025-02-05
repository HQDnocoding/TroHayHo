from rest_framework import permissions
from oauth2_provider.contrib.rest_framework import TokenHasReadWriteScope, TokenHasScope

allowed_groups = ['Chủ trọ', 'Người thuê trọ']
# chi cho phep chu tro va thue tro
class IsInRenterOrOwnerGroup(permissions.BasePermission):
    def has_permission(self, request, view):
        # khiem tra user thong qua ouath2 ko
        if not bool(request.user and request.user.is_authenticated):
            return False
            
        # ktra ng nay co trong group va cco pham vi truy cap (pham vi truy cap truy chinh trong viewset) khong
        return (request.user.groups.filter(name__in=allowed_groups).exists() and 
                TokenHasScope().has_permission(request, view))

# y chang o tren nhung danh cho chu tro
class IsInOwnerGroup(permissions.BasePermission):
    def has_permission(self, request, view):
        if not bool(request.user and request.user.is_authenticated):
            return False
            
        return (request.user.groups.filter(name=allowed_groups[0]).exists() and 
                TokenHasScope().has_permission(request, view))

# :v nhin la hieu
class IsInRenterGroup(permissions.BasePermission):
    def has_permission(self, request, view):
        if not bool(request.user and request.user.is_authenticated):
            return False
            
        return (request.user.groups.filter(name=allowed_groups[1]).exists() and 
                TokenHasScope().has_permission(request, view))