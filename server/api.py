from flask import Blueprint
from utils.word_list import word_list as words_list

api = Blueprint('api', __name__)

@api.route('/api/word-list')
def word_list() -> list:
    return words_list
