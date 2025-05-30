from flask import Blueprint, jsonify, abort;
from utils.word_list import word_dict, get_correct_words;
from datetime import datetime, timezone, timedelta;

api = Blueprint('api', __name__); 

@api.route('/api/word-list/<theme>')
def word_list(theme: str) -> list:
    '''
    get the list with all words and the 6 words of the selected theme
    '''
    if theme.split('_')[1] not in word_dict['theme_list']:
        abort(404); 
    correct_words = get_correct_words()[theme]; 
    return jsonify({'word_list': word_dict['theme_all'], 'word_list_theme': word_dict[theme], 'word1': correct_words[0], 'word2': correct_words[1], 'word3': correct_words[2], 'word4': correct_words[3], 'word5': correct_words[4], 'word6': correct_words[5]}); 

@api.route('/date-time')
def date_time() -> str:
    dt_now = datetime.now(timezone(timedelta(hours=-3))).strftime("%d-%m-%Y %H:%M:%S"); 
    d_now, t_now = dt_now.split()[0], dt_now.split()[1]; 
    return jsonify({'date': d_now, 'time': t_now}); 
