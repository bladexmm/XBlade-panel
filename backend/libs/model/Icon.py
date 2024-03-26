import json

from libs.model.models import db


class Icon(db.Model):
    __tablename__ = 'icon'
    id = db.Column(db.String(32), primary_key = True)
    name = db.Column(db.String(32), index = True)
    path = db.Column(db.Text)

    def to_dict(self):
        return {
            'id'  : self.id,
            'name': self.name,
            'path': json.loads(self.path),
        }
