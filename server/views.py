from flask import Blueprint, render_template, abort;
from utils.word_list import word_dict;

view = Blueprint('view', __name__); 

@view.route('/')
def index() -> render_template:
    return render_template('index.jinja'); 

@view.route('/<theme>')
def game(theme: str) -> render_template:
    if theme not in word_dict['theme_list']:
        abort(404); 
    return render_template('game.jinja', theme=theme); 

@view.route('/2/<theme>')
def game2(theme: str) -> render_template:
    if theme not in word_dict['theme_list']:
        abort(404); 
    return render_template('game2.jinja', theme=theme); 

@view.route('/3/<theme>')
def game3(theme: str) -> render_template:
    if theme not in word_dict['theme_list']:
        abort(404); 
    return render_template('game3.jinja', theme=theme); 
