from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.jobs.models import Job
from decimal import Decimal

User = get_user_model()

class Command(BaseCommand):
    help = 'Populate the database with sample job listings'

    def handle(self, *args, **options):
        # Create a default employer user if it doesn't exist
        employer, created = User.objects.get_or_create(
            email='employer@nextstep.com',
            defaults={
                'username': 'employer@nextstep.com',
                'first_name': 'Sample',
                'last_name': 'Employer',
                'is_staff': True,
            }
        )
        
        if created:
            self.stdout.write(f'Created employer user: {employer.email}')
        else:
            self.stdout.write(f'Using existing employer user: {employer.email}')

        # Sample jobs data
        jobs_data = [
            {
                'title': 'Lawn Mowing & Yard Work',
                'company': 'Green Thumb Services',
                'location': 'Scarborough, ON',
                'hourly_rate_min': Decimal('20.00'),
                'hourly_rate_max': Decimal('25.00'),
                'job_type': 'gig',
                'schedule': 'flexible',
                'description': 'Help homeowners maintain their lawns and gardens. Perfect for teens who enjoy outdoor work and want flexible hours. Duties include mowing lawns, trimming hedges, raking leaves, and basic garden maintenance.',
                'requirements': [
                    'Must be 14+ years old',
                    'Reliable transportation',
                    'Basic lawn care knowledge',
                    'Physical stamina for outdoor work',
                    'Available weekends and after school'
                ],
                'tags': ['Outdoors', 'Flexible', 'Physical Work', 'Garden', 'Lawn Care'],
                'rating': Decimal('4.6'),
                'review_count': 34,
                'featured': True,
            },
            {
                'title': 'Private Math Tutor',
                'company': 'Toronto Math Academy',
                'location': 'North York, ON',
                'hourly_rate_min': Decimal('25.00'),
                'hourly_rate_max': Decimal('35.00'),
                'job_type': 'part-time',
                'schedule': 'part-time',
                'description': 'Tutor students in math subjects from elementary to high school. Great opportunity for students who excel in mathematics. Help students understand concepts, complete homework, and prepare for tests.',
                'requirements': [
                    'Must be 16+ years old',
                    'Strong math skills (A+ in math courses)',
                    'Patient and encouraging personality',
                    'Experience helping others learn',
                    'Available after school and weekends'
                ],
                'tags': ['Education', 'Math', 'Teaching', 'Tutoring', 'Academic'],
                'rating': Decimal('4.8'),
                'review_count': 42,
                'featured': False,
            },
            {
                'title': 'Lifeguard',
                'company': 'Toronto Community Centres',
                'location': 'Etobicoke, ON',
                'hourly_rate_min': Decimal('18.00'),
                'hourly_rate_max': Decimal('22.00'),
                'job_type': 'part-time',
                'schedule': 'part-time',
                'description': 'Ensure pool safety and assist swimmers. Perfect for strong swimmers who want to develop leadership skills. Monitor pool activities, enforce safety rules, and provide emergency assistance when needed.',
                'requirements': [
                    'Must be 16+ years old',
                    'Lifeguard certification (Bronze Cross minimum)',
                    'Strong swimming ability',
                    'First Aid and CPR certification',
                    'Available for weekend and evening shifts'
                ],
                'tags': ['Safety', 'Swimming', 'Leadership', 'Community', 'Health'],
                'rating': Decimal('4.4'),
                'review_count': 28,
                'featured': False,
            },
            {
                'title': 'Camp Counselor',
                'company': 'High Park Nature Camp',
                'location': 'Toronto, ON',
                'hourly_rate_min': Decimal('16.00'),
                'hourly_rate_max': Decimal('20.00'),
                'job_type': 'seasonal',
                'schedule': 'full-time',
                'description': 'Lead outdoor activities and supervise children during summer camp. Great for nature lovers and outgoing teens. Plan and lead games, crafts, nature walks, and educational activities.',
                'requirements': [
                    'Must be 16+ years old',
                    'First aid certification preferred',
                    'Enthusiastic and energetic personality',
                    'Experience working with children',
                    'Available for full summer (July-August)'
                ],
                'tags': ['Summer', 'Education', 'Outdoors', 'Children', 'Nature'],
                'rating': Decimal('4.7'),
                'review_count': 56,
                'featured': True,
            },
            {
                'title': 'Retail Assistant',
                'company': 'Yorkdale Shopping Centre',
                'location': 'Toronto, ON',
                'hourly_rate_min': Decimal('15.00'),
                'hourly_rate_max': Decimal('18.00'),
                'job_type': 'part-time',
                'schedule': 'part-time',
                'description': 'Assist customers and maintain store appearance. Perfect opportunity to develop customer service and retail skills. Help customers find products, process transactions, and keep the store organized.',
                'requirements': [
                    'Must be 15+ years old',
                    'Friendly and helpful attitude',
                    'Available weekends and holidays',
                    'Basic math skills',
                    'Professional appearance'
                ],
                'tags': ['Retail', 'Customer Service', 'Shopping', 'Sales', 'Fashion'],
                'rating': Decimal('4.1'),
                'review_count': 31,
                'featured': False,
            },
            {
                'title': 'Pet Sitter & Dog Walker',
                'company': 'Pawsome Pet Care',
                'location': 'Mississauga, ON',
                'hourly_rate_min': Decimal('18.00'),
                'hourly_rate_max': Decimal('25.00'),
                'job_type': 'gig',
                'schedule': 'flexible',
                'description': 'Care for pets while owners are away. Perfect for animal lovers! Walk dogs, feed pets, clean litter boxes, and provide companionship. Flexible hours and great for building responsibility.',
                'requirements': [
                    'Must be 14+ years old',
                    'Love for animals',
                    'Reliable and responsible',
                    'Available for drop-in visits',
                    'Comfortable with different pet sizes'
                ],
                'tags': ['Animals', 'Flexible', 'Pet Care', 'Walking', 'Companionship'],
                'rating': Decimal('4.9'),
                'review_count': 23,
                'featured': False,
            },
            {
                'title': 'Babysitter',
                'company': 'Family Care Network',
                'location': 'Markham, ON',
                'hourly_rate_min': Decimal('16.00'),
                'hourly_rate_max': Decimal('22.00'),
                'job_type': 'part-time',
                'schedule': 'evenings',
                'description': 'Provide childcare for families in your area. Great opportunity to develop responsibility and childcare skills. Supervise children, prepare meals, help with homework, and engage in age-appropriate activities.',
                'requirements': [
                    'Must be 15+ years old',
                    'Experience with children preferred',
                    'Patient and caring personality',
                    'Available evenings and weekends',
                    'First aid knowledge helpful'
                ],
                'tags': ['Childcare', 'Evenings', 'Family', 'Responsibility', 'Care'],
                'rating': Decimal('4.5'),
                'review_count': 19,
                'featured': False,
            },
            {
                'title': 'Grocery Store Clerk',
                'company': 'Fresh Market',
                'location': 'Vaughan, ON',
                'hourly_rate_min': Decimal('15.50'),
                'hourly_rate_max': Decimal('17.50'),
                'job_type': 'part-time',
                'schedule': 'part-time',
                'description': 'Help customers and maintain store operations. Learn about food safety, customer service, and retail operations. Stock shelves, assist customers, and help with inventory management.',
                'requirements': [
                    'Must be 15+ years old',
                    'Available for evening and weekend shifts',
                    'Good communication skills',
                    'Ability to lift moderate weights',
                    'Food safety training provided'
                ],
                'tags': ['Retail', 'Food', 'Customer Service', 'Stocking', 'Grocery'],
                'rating': Decimal('4.2'),
                'review_count': 27,
                'featured': False,
            },
            {
                'title': 'Library Assistant',
                'company': 'Toronto Public Library',
                'location': 'Toronto, ON',
                'hourly_rate_min': Decimal('17.00'),
                'hourly_rate_max': Decimal('19.00'),
                'job_type': 'part-time',
                'schedule': 'part-time',
                'description': 'Help maintain library operations and assist patrons. Perfect for book lovers! Shelve books, help with computer questions, assist with programs, and provide customer service.',
                'requirements': [
                    'Must be 16+ years old',
                    'Love for books and learning',
                    'Good organizational skills',
                    'Available for weekend shifts',
                    'Basic computer skills'
                ],
                'tags': ['Library', 'Books', 'Education', 'Quiet', 'Learning'],
                'rating': Decimal('4.6'),
                'review_count': 15,
                'featured': False,
            },
            {
                'title': 'Restaurant Host/Hostess',
                'company': 'Downtown Diner',
                'location': 'Toronto, ON',
                'hourly_rate_min': Decimal('16.00'),
                'hourly_rate_max': Decimal('18.00'),
                'job_type': 'part-time',
                'schedule': 'evenings',
                'description': 'Welcome guests and manage restaurant seating. Great opportunity to develop hospitality skills. Greet customers, manage reservations, seat guests, and help maintain a welcoming atmosphere.',
                'requirements': [
                    'Must be 16+ years old',
                    'Friendly and outgoing personality',
                    'Available for evening shifts',
                    'Good communication skills',
                    'Professional appearance'
                ],
                'tags': ['Restaurant', 'Hospitality', 'Evenings', 'Customer Service', 'Food'],
                'rating': Decimal('4.3'),
                'review_count': 22,
                'featured': False,
            }
        ]
        
        # Create jobs
        created_count = 0
        for job_data in jobs_data:
            job, created = Job.objects.get_or_create(
                title=job_data['title'],
                company=job_data['company'],
                defaults={
                    **job_data,
                    'employer': employer
                }
            )
            if created:
                created_count += 1
                self.stdout.write(f'Created job: {job.title}')
            else:
                self.stdout.write(f'Job already exists: {job.title}')
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {created_count} new jobs!')
        ) 