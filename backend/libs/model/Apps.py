from datetime import datetime
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey

from libs.model.models import db


class Apps(db.Model):
    __tablename__ = 'apps'
    id            = db.Column(db.String(32), primary_key=True)
    pid           = db.Column(db.String(32), ForeignKey('apps.id'))  # 新增字段，外键指向自身id
    parent        = relationship("Apps", remote_side=[id], backref="children")  # 添加反向引用

    name    = db.Column(db.String(255))
    icon    = db.Column(db.String(255))
    pinyin  = db.Column(db.String(255))
    path    = db.Column(db.Text)
    type    = db.Column(db.Enum('file', 'link', 'command', 'components'))
    open    = db.Column(db.Integer, default=0)
    created = db.Column(db.DateTime, default=datetime.utcnow)  # Set a default value

    def to_dict(self, include_children=False):
        data = {
            'id'      : self.id,
            'pid'     : self.pid,
            'name'    : self.name,
            'icon'    : self.icon,
            'pinyin'  : self.pinyin,
            'path'    : self.path,
            'type'    : self.type,
            'open'    : self.open,
            'created' : self.created.strftime('%Y-%m-%d %H:%M:%S'),
            'children': None
        }

        if include_children and self.children:
            data['children'] = [child.to_dict() for child in self.children]
        return data