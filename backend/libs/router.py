from libs.controllers.AppsResource import AppsResource, OpenResource, FetchResource, ShareResource
from libs.controllers.IconResource import IconResource
from libs.controllers.LayoutsResource import LayoutsResource, SaveResource
from libs.controllers.ToolsResource import CMDResource, StreamResource, TestResource, WallpaperResource, UploadResource, \
    ScriptResource, BackupResource, ImportResource

resources = (
    (CMDResource, '/api/tools/commands'),
    (StreamResource, '/api/tools/stream'),
    (WallpaperResource, '/api/tools/wallpaper'),
    (BackupResource, '/api/tools/backup'),
    (ImportResource, '/api/tools/import'),
    (TestResource, '/api/tools/test'),
    
    (UploadResource, '/api/upload/image'),
    (ScriptResource, '/api/upload/script'),

    (LayoutsResource, '/api/layouts'),
    (SaveResource, '/api/layouts/save'),

    (AppsResource, '/api/apps'),
    (OpenResource, '/api/apps/open'),
    (FetchResource, '/api/apps/fetch'),
    (ShareResource, '/api/apps/share'),
    (IconResource, '/api/icon')

)
