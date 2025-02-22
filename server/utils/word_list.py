from datetime import datetime, timezone, timedelta;
import random;

word_dict = {
    'theme_list' : ['all', 'aleatorio', 'objeto', 'tecnologia', 'aviação', 'pisca'],
    'theme_all' : ['curió', 'ossos', 'pisca', 'mitos', 'corte', 'pesca', 'peixe', 'vídeo', 'ruela', 'reage', 'termo', 'beber', 'jogos', 'barco', 'graça', 'sabiá',    'sagaz', 'êxito', 'nobre', 'senso', 'afeto', 'ética', 'tênue', 'sobre', 'radar', 'vigor', 'ideia', 'carne', 'moral', 'desde', 'boçal', 'justo', 'sonho', 'razão', 'pouso', 'amigo', 'ícone', 'fútil', 'etnia', 'anexo', 'nível', 'barra', 'tempo', 'dever', 'bardo', 'posse', 'corja', 'brado', 'digno', 'pauta', 'mundo', 'censo', 'culto', 'criar', 'louco', 'regra', 'limbo', 'ordem', 'juízo', 'sábio', 'falso', 'manso', 'valor', 'sério', 'acaso', 'lugar', 'faixa', 'caixa', 'união', 'gerar', 'obter', 'olhar', 'funil', 'levar', 'bravo', 'falta', 'reter', 'único', 'noção', 'noite', 'nosso', 'claro', 'ativo', 'papel', 'farsa', 'fator', 'velho', 'árduo', 'fonte', 'marco', 'igual', 'vazio', 'hiato', 'ciclo', 'relva', 'ótica', 'jovem', 'gesto', 'ambos', 'tenra', 'imune', 'fusão', 'brisa', 'verso', 'sorte', 'vimos', 'apoio', 'chuva', 'frase', 'carro', 'doido', 'botar', 'ímpar', 'dorso', 'maior', 'menor', 'fauna', 'covil', 'signo', 'dócil', 'praia', 'agora', 'áurea', 'árido', 'vírus', 'manha', 'risco', 'pátio', 'ceifa', 'sexto', 'lucro', 'fenda', 'grave', 'grava', 'balão', 'vetor', 'curva', 'final', 'rádio', 'terra', 'fogos', 'avião', 'texto', 'teste', 'ponte', 'santo', 'norte', 'leste', 'oeste', 'pista', 'volta', 'acena', 'rotas', 'festa', 'banda', 'bando', 'cervo', 'junto', 'folha', 'caldo', 'cargo', 'traga', 'tecla', 'palha', 'mútuo', 'calmo', 'tigre', 'carta'],
    'theme_objeto' : ['ruela', 'barco', 'barra', 'caixa', 'funil', 'papel', 'fonte', 'carro', 'balão', 'rádio', 'fogos', 'avião', 'tecla', 'carta'],
    'theme_tecnologia' : ['vídeo', 'jogos', 'radar', 'fonte', 'fusão', 'vírus', 'carro', 'rádio', 'avião', 'tecla'],
    'theme_aviação' : ['razão', 'vigor', 'pouso', 'nível', 'barra', 'pátio', 'balão', 'radar', 'vetor', 'curva', 'rádio', 'notam', 'metar', 'speci', 'final', 'decea', 'norte', 'leste', 'oeste', 'pista', 'rotas', 'carta'],
    'theme_pisca' : ['curió', 'ossos', 'pisca', 'mitos', 'corte', 'pesca', 'peixe', 'vídeo', 'ruela', 'reage', 'termo', 'beber', 'jogos', 'barco', 'graça', 'sabiá']
}; 

day = datetime.now(timezone(timedelta(hours=-3))).strftime("%d"); 
correct_day_word = {'theme_all': [], 'theme_objeto': [], 'theme_tecnologia': [], 'theme_aviação': [], 'theme_pisca': [],}; 

def add_words( ) -> None:
    '''
    add 6 random word index to the lists
    '''
    correct_day_word['theme_all'].extend(random.sample(range(len(word_dict['theme_all'])), 6)); 
    correct_day_word['theme_objeto'].extend(random.sample(range(len(word_dict['theme_objeto'])), 6)); 
    correct_day_word['theme_tecnologia'].extend(random.sample(range(len(word_dict['theme_tecnologia'])), 6)); 
    correct_day_word['theme_aviação'].extend(random.sample(range(len(word_dict['theme_aviação'])), 6)); 
    correct_day_word['theme_pisca'].extend(random.sample(range(len(word_dict['theme_pisca'])), 6)); 

add_words( ); 

def get_correct_words( ) -> dict:
    global day, correct_day_word; 

    day_now = datetime.now(timezone(timedelta(hours=-3))).strftime("%d"); 

    if day_now != day:
        for k, v in correct_day_word.items():
            v.clear( ); 
        add_words( ); 
        day = day_now; 
    
    return correct_day_word; 
