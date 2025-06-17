from flask import Flask;
from views import view;
from api import api;
from whitenoise import WhiteNoise;
import os;

app = Flask(__name__,
            template_folder = os.path.join(os.path.abspath(os.path.dirname(__file__)), '..', 'ui', 'templates'),
            static_folder = os.path.join(os.path.abspath(os.path.dirname(__file__)), '..', 'ui', 'static')
        ); 

app.wsgi_app = WhiteNoise(app.wsgi_app, root=app.static_folder); 

app.register_blueprint(view); 
app.register_blueprint(api); 

if __name__ == "__main__":
    app.run(debug=False); 
