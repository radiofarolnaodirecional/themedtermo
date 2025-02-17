from flask import Flask;
from views import view;
from api import api;
import os;

app = Flask(__name__, template_folder = os.path.abspath('./ui/templates'), static_folder = os.path.abspath('./ui/static')); 

app.register_blueprint(view); 
app.register_blueprint(api); 

if __name__ == "__main__":
    app.run(debug=False); 
