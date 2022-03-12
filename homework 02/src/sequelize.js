const { Sequelize, Model, DataTypes } = require('@sequelize/core');

const sequelize = new Sequelize('cloud', 'postgres', 'postgresql', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
});

export class MovieModel extends Model {
    getActors;
    addActor;
    removeActor;
}
export class ActorModel extends Model {
    getMovies;
    addMovie;
    removeMovie;
}
export class MovieActors extends Model {}

MovieModel.init({
    title: {type: DataTypes.STRING, allowNull: false},
    year: {type: DataTypes.INTEGER, allowNull: false},
    genre: {type: DataTypes.STRING, allowNull: false},
    rating: {type: DataTypes.FLOAT, allowNull: false},
}, {sequelize, modelName: 'movies'});

ActorModel.init({
    name: {type: DataTypes.STRING, allowNull: false},
    age: {type: DataTypes.INTEGER, allowNull: false},
}, {sequelize, modelName: 'actors'});

MovieActors.init({
    movieId: {
        type: DataTypes.INTEGER,
        unique: 'tt_unique_constraint',
    },
    actorId: {
        type: DataTypes.INTEGER,
        unique: 'tt_unique_constraint',
    }
}, {sequelize, modelName: 'movie_actors'});

MovieModel.belongsToMany(ActorModel, {
    through: {
        model: MovieActors,
        unique: false,
    },
    foreignKey: 'movieId',
    constraints: false,
    onDelete: 'cascade',
});
ActorModel.belongsToMany(MovieModel, {
    through: {
        model: MovieActors,
        unique: false,
    },
    foreignKey: 'actorId',
    constraints: false,
    onDelete: 'cascade',
})

export async function initDatabase() {
    await sequelize.sync({force: true});
    console.log("Successfully connected");

    const movie = await MovieModel.create({
        title: 'The lord of the rings',
        year: 2004,
        genre: 'Adventure',
        rating: 9.8,
    });

    const actorA = await ActorModel.create({
        name: 'Leonardo DiCaprio',
        age: 54,
    });

    const actorB = await ActorModel.create({
        name: 'Louis de Fune',
        age: 129,
    });

    await movie.addActor(actorA);
}
