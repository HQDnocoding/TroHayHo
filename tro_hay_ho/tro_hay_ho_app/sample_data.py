import os
import django
import random
from faker import Faker

from .models import User, Role, Address, PostWant, PostForRent

def create_sample_data():
    try:
        # Initialize Faker
        faker = Faker()
        default_roles = ['Admin', 'chu_tro', 'nguoi_thue_tro']
        # Create Roles (if not already created)
        role_1, _ = Role.objects.get_or_create(id=1, defaults={'role_name': default_roles[0]})

        role_2, _ = Role.objects.get_or_create(id=2, defaults={'role_name': default_roles[1]})
        role_3, _ = Role.objects.get_or_create(id=3, defaults={'role_name': default_roles[2]})

        # Create 10 Users
        users = []
        for i in range(10):
            username = faker.user_name()
            email = faker.email()
            phone = faker.phone_number()
            role = role_2 if i < 5 else role_3

            user = User.objects.create(
                username=username,
                email=email,
                phone=phone,
                role=role,
                is_active=True
            )
            users.append(user)

        print(f"Created {len(users)} users")

        # Create 10 Addresses
        addresses = []
        for _ in range(10):
            address = Address.objects.create(
                specified_address=faker.address(),
                coordinates=f"{faker.latitude()}, {faker.longitude()}",
                province=None,  # Set these as None or replace with actual foreign keys if available
                district=None,
                ward=None
            )
            addresses.append(address)

        print(f"Created {len(addresses)} addresses")

        # Create 10 PostWant entries for users with role 3
        post_wants = []
        role_3_users = [user for user in users if user.role.id == 3]
        for user in role_3_users:
            for _ in range(2):
                post = PostWant.objects.create(
                    title=faker.sentence(),
                    description=faker.text(),
                    price_range_min=random.uniform(100, 500),
                    price_range_max=random.uniform(500, 1000),
                    user=user
                )
                post_wants.append(post)

        print(f"Created {len(post_wants)} PostWant entries")

        # Create 10 PostForRent entries for users with role 2
        post_for_rents = []
        role_2_users = [user for user in users if user.role.id == 2]
        for user in role_2_users:
            for _ in range(2):
                post = PostForRent.objects.create(
                    title=faker.sentence(),
                    description=faker.text(),
                    acreage=random.uniform(20, 100),
                    max_number_of_people=random.randint(1, 10),
                    phone_contact=faker.phone_number(),
                    name_agent=faker.name(),
                    verified=True,
                    user=user
                )
                post_for_rents.append(post)

        print(f"Created {len(post_for_rents)} PostForRent entries")
    except:
        pass
