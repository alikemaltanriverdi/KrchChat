from django import template

register = template.Library()


@register.filter(name='filename')
def filename(value):
    """
        Returns the value turned into a list.
    """
    parts = value.split(',')
    #return type(parts)
    return parts[1][2:-1]

@register.filter(name='get_link')
def get_link(value):
    """
        Returns the value turned into a list.
    """
    parts = value.split(',')
    return ",".join(parts[2:])[2:-2]
@register.filter(name='extension')
def get_link(value):
    """
        Returns the value turned into a list.
    """
    
    return value.split(".")[1]