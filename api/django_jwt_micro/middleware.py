from django.conf import settings
from django.utils.module_loading import import_string
from django.core.urlresolvers import reverse, NoReverseMatch


class AdminMiddlewareWrapper(object):

    def __init__(self):
        self.admin_index = '/admin/'
        self.load_middleware()

    def load_middleware(self):
        self._request_middleware = []
        self._view_middleware = []
        self._template_response_middleware = []
        self._response_middleware = []
        self._exception_middleware = []

        for middleware_path in settings.ADMIN_MIDDLEWARE_CLASSES:
            #import pdb; pdb.set_trace()
            mw_class = import_string(middleware_path)
            try:
                mw_instance = mw_class()
            except MiddlewareNotUsed as exc:
                if settings.DEBUG:
                    if six.text_type(exc):
                        logger.debug('MiddlewareNotUsed(%r): %s', middleware_path, exc)
                    else:
                        logger.debug('MiddlewareNotUsed: %r', middleware_path)
                continue

            if hasattr(mw_instance, 'process_request'):
                self._request_middleware.append(mw_instance.process_request)
                setattr(self, 'process_request', self.__process_request)

            if hasattr(mw_instance, 'process_view'):
                self._view_middleware.append(mw_instance.process_view)
                setattr(self, 'process_view', self.__process_view)

            if hasattr(mw_instance, 'process_template_response'):
                self._template_response_middleware.insert(0, mw_instance.process_template_response)
                setattr(self, 'process_template_response', self.__process_template_response)

            if hasattr(mw_instance, 'process_response'):
                self._response_middleware.insert(0, mw_instance.process_response)
                setattr(self, 'process_response', self.__process_response)

            if hasattr(mw_instance, 'process_exception'):
                self._exception_middleware.insert(0, mw_instance.process_exception)
                setattr(self, 'process_exception', self.__process_exception)

    def __process_request(self, request):
        if not request.path.startswith(self.admin_index):
            return
        for middleware_method in self._request_middleware:
            response = middleware_method(request)
            if response:
                return response

    def __process_view(self, request, view_func, view_args, view_kwargs):
        if not request.path.startswith(self.admin_index):
            return
        for middleware_method in self._view_middleware:
            response = middleware_method(request, view_func, view_args, view_kwargs)
            if response:
                return response

    def __process_template_response(self, request, response):
        if not request.path.startswith(self.admin_index):
            return response
        for middleware_method in self._template_response_middleware:
            response = middleware_method(request, response)
            if response:
                return response

    def __process_response(self, request, response):
        if not request.path.startswith(self.admin_index):
            return response
        for middleware_method in self._response_middleware:
            response = middleware_method(request, response)
            if response:
                return response

    def __process_exception(self, request, exception):
        if not request.path.startswith(self.admin_index):
            raise
        for middleware_method in self._exception_middleware:
            response = middleware_method(request, exception)
            if response:
                return response
        raise
