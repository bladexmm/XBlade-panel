from libs.model.models import db
from datetime import datetime


class SystemApps(db.Model):
    __tablename__ = 'system_apps'
    id = db.Column(db.String(32), primary_key = True)
    name = db.Column(db.String(255))
    ext = db.Column(db.String(255))
    pinyin = db.Column(db.String(255))
    short_path = db.Column(db.String(255))
    path = db.Column(db.Text)
    icon = db.Column(db.Text)
    created = db.Column(db.DateTime, default = datetime.utcnow)

    def to_dict(self):
        return {
            'id'        : self.id,
            'name'      : self.name,
            'ext'       : self.ext,
            'pinyin'    : self.pinyin,
            'short_path': self.short_path,
            'path'      : self.path,
            'icon'      : self.icon,
            'created'   : self.created.strftime('%Y-%m-%d %H:%M:%S'),
        }
