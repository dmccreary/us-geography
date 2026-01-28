from setuptools import setup

setup(
    name='mkdocs-social-override',
    version='1.0.0',
    packages=['plugins'],
    entry_points={
        'mkdocs.plugins': [
            'social_override = plugins.social_override:SocialOverridePlugin',
        ]
    }
)
