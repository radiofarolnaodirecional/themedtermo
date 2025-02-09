from flask import Blueprint, render_template, abort
from utils.theme_list import themes

view = Blueprint('view', __name__)

@view.route('/')
def index() -> render_template:
    return render_template('index.jinja')

@view.route('/<theme>')
def game(theme: str) -> render_template:
    if theme not in themes:
        abort(404)
    return render_template('game.jinja', theme=theme)

@view.route('/2/<theme>')
def game2(theme: str) -> render_template:
    if theme not in themes:
        abort(404)
    return render_template('game2.jinja', theme=theme)
