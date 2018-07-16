
const fixtures = require("./fixtures/fixtures");
const movieController = require("../movie-v1-controller");

const response = fixtures.responses;
const request = fixtures.requests;

jest.mock('../movie-v1-controller', () => ({
    getMovieList : jest.fn(),
    getMovie: jest.fn(),
    insertMovieProcess: jest.fn()
}));

movieController.insertMovieProcess.mockImplementation(() => Promise.resolve({"status"  : "success"}));
movieController.getMovieList.mockImplementation(() => Promise.resolve(response.getMovieListSuccess));
movieController.getMovie.mockImplementation(() => Promise.resolve(response.getMovieByIdSuccess));
movieController.insertMovieProcess.mockImplementation(() => Promise.resolve(response.validationError));

afterEach(() => {
    jest.clearAllMocks();
});

describe("Get movie list", () => {
    test('should display an object', async () => {
        const resp = await movieController.getMovieList();
        expect(resp.status).toEqual("success");       
    });

    test('Result count should be >= 1', async () => {
        const resp = await movieController.getMovieList();
        expect(resp.result.Count).toBeGreaterThan(0);       
    });
});

describe("Get movie by id", () => {
    test('if id is available, result item should not be empty', async () => {
        const resp = await movieController.getMovie();
        expect(resp.result.Item).not.toBeNull();    
    });

    test('If id is available, result status should be success', async () => {
        const resp = await movieController.getMovie();
        expect(resp.status).toEqual("success");    
    });
});

describe("Insert movie",  () => {
    test('Display error message if title is null',  async () => {
        const resp = await movieController.insertMovieProcess(request.missingTitle.req);
        expect(resp.error).toEqual("Validation Failed, can't insert movie."); 
    });

    test('Display error message if any input parameters are empty',  async () => {
        const resp = await movieController.insertMovieProcess(request.emptyTitle.req);
        expect(resp.error).toEqual("Validation Failed, can't insert movie."); 
    });

    test('Display error message if any input parameters are not strings',  async () => {
        const resp = await movieController.insertMovieProcess(request.numericTitle.req);
        expect(resp.error).toEqual("Validation Failed, can't insert movie."); 
    });

    test('Display error message if title is already in system',  async () => {
        movieController.insertMovieProcess.mockImplementation(() => Promise.resolve(response.duplicateTitle));        
        const resp = await movieController.insertMovieProcess(request.numericTitle.req);
        expect(resp.error).toEqual("Error: movie already has this title - title1"); 
    });

    test('Display success message if movie is inserted',  async () => {
        movieController.insertMovieProcess.mockImplementation(() => Promise.resolve(response.movieInsertedSuccess));
        const resp = await movieController.insertMovieProcess(request.correctRequest.req);
        expect(resp.status).toEqual("success"); 
    });

});

