from mkdocs.plugins import BasePlugin
from mkdocs.config import config_options


class SocialOverridePlugin(BasePlugin):
    config_scheme = (
        ('enabled', config_options.Type(bool, default=True)),
    )

    def on_page_context(self, context, page, config, nav):
        if page.meta.get('image'):
            image_path = page.meta['image']
            if not image_path.startswith(('http://', 'https://')):
                image_path = config['site_url'].rstrip('/') + '/' + image_path.lstrip('/')
            context['page'].meta['image'] = image_path
        return context
