const default_login = 'odc'
const default_password = '7112022'

const CGO = {id: 1, name: 'RDC', sigle: 'CGO'};
const BELGIQUE = {id: 2, name: 'Belgique', sigle: 'BEG'};
const USA = {id: 3, name: 'USA', sigle: 'USA'};
const FRANCE = {id: 4, name: 'France', sigle: 'FR'};

const countries = {
    CGO,
    BELGIQUE,
    USA,
    FRANCE
}

const articles = [
    {"name": "Oeuf", "prix": 500},
    {"name": "Cahier", "prix": 1500},
    {"name": "Margarine", "prix": 2800},
    {"name": "Stylo", "prix": 600},
    {"name": "Biscuit", "prix": 1000},
]

module.exports = {
    default_login,
    default_password,
    countries,
    articles
};