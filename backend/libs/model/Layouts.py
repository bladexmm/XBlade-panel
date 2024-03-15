from libs.model.models import db


class Layouts(db.Model):
    __tablename__ = 'layouts'
    id            = db.Column(db.String(32), primary_key=True)
    name          = db.Column(db.String(10), index=True)
    i             = db.Column(db.String(32))
    x             = db.Column(db.Integer, default=3)
    y             = db.Column(db.Integer, default=0)
    w             = db.Column(db.Integer, default=1)
    h             = db.Column(db.Integer, default=1)
    moved         = db.Column(db.Boolean, default=False)
    static        = db.Column(db.Boolean, default=False)

    __table_args__ = (db.UniqueConstraint('name', 'i'),)

    def to_dict(self):
        return {
            'id'    : self.id,
            'name'  : self.name,
            'i'     : self.i,
            'x'     : self.x,
            'y'     : self.y,
            'w'     : self.w,
            'h'     : self.h,
            'moved' : self.moved,
            'static': self.static,
        }
