import React, { FunctionComponent } from 'react';
import { SearchState } from '../SearchResults/SearchState';
import { SearchResults } from '../SearchResults/SearchResults';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import * as mockdata from '../../mockdata';
import * as data from './Data/index';
import { QueryDatasetInfoBox } from './QueryDataset';
import { aggregateResults } from '../../api/augmentation';

const TopContainer: FunctionComponent = ({ children }) => {
  return (
    <div
      className="container-fluid pt-1 pb-1"
      style={{ backgroundColor: '#f0f0f0' }}
    >
      <div className="container mt-3">{children}</div>
    </div>
  );
};

function LandingPage() {
  return (
    <div className="container mt-3">
      <h1 className="mb-3">Dataset Search for Data Augmentation Study</h1>
      <p>
        Welcome to "Dataset Search for Data Augmentation Study," an experiment
        that examines the utility of search user interfaces for tabular data
        retrieval. The ultimate goal of this experiment is to evaluate the
        ability of the visual components of a dataset search engine interface to
        convey relevant information to the users so that they can decide whether
        a search result is relevant for the given query.
      </p>
      <p>
        Differently from a web search engine, where the query is a textual
        passage and the search results are web pages, in a dataset search engine
        for data augmentation, the query is a tabular dataset (e.g., a CSV file)
        and the search results are other tabular datasets relevant to your input
        query.
      </p>
      <p>
        For this experiment, you should assume that you are tasked with building
        a regression model for predicting a certain outcome (the target
        variable). You already have an initial dataset but you need to discover
        additional data to include in your initial table to improve the
        prediction performance of your regression model. To discover new
        datasets, you will use a dataset search engine.
      </p>
      <p>
        We will ask you to evaluate the search results returned from a search
        engine for two different query datasets. For each case, we first will
        show information about the query dataset (including its title, metadata,
        and a few samples of the data). Next, the system will display a list of
        search results that are possibly relevant for your query dataset. Your
        task will be to examine each search result and determine which of the
        search results is more likely to improve the performance of a prediction
        model that includes this search results' data. To access the query table
        information and the search results, you should access the links provided
        in the next steps. Once you finished reviewing the results, please
        complete answering the questions in this survey.
      </p>

      <div>
        <b>See Query Datasets:</b>
        <Link to="/vehicle-collisions/data/" className="btn btn-lg btn-primary ml-3">
          NYC Vehicle Collisions
        </Link>

        <Link to="/poverty/data/" className="btn btn-lg btn-primary ml-3">
          Poverty Estimation
        </Link>
      </div>
    </div>
  );
}

function Query1Data() {
  return (
    <>
      <TopContainer>
        <h2>Step 1: Query Dataset (NYC Vehicle Collisions)</h2>
        <p>
          In this dataset, your goal is to gather data for building a regression
          model that predicts the number of vehicle collisions in NYC between
          July and December 2014. Once you review the dataset below, click on
          the button "Evaluate Search Results" to go the next page.
        </p>
        <Link
          to="/vehicle-collisions/search-results/"
          className="btn btn-lg btn-primary mb-2"
        >
          Go to Step 2: Evaluate Search Results
        </Link>
      </TopContainer>
      <div className="container mt-3">
        <QueryDatasetInfoBox
          hit={data.vehicleCollisionsQuery}
          targetIndex={2}
        />
      </div>
    </>
  );
}

function Query1Results() {
  const { searchQuery } = mockdata;
  const searchState = SearchState.SEARCH_SUCCESS;
  const searchResponse = {
    ...data.vehicleCollisionsResults,
    results: aggregateResults(data.vehicleCollisionsResults.results).slice(
      0,
      10
    ),
  };
  return (
    <>
      <TopContainer>
        <h2>Step 2: Search Results (NYC Vehicle Collisions)</h2>
        <p>
          Bellow is list of datasets retrieved by a search engine that you could
          use to try to augment and improve your prediction model. Please,
          examine them and return to the survey to respond a few questions about
          them.
        </p>
      </TopContainer>
      <div className="container-fluid mt-3">
        <SearchResults
          searchQuery={searchQuery}
          searchState={searchState}
          searchResponse={searchResponse}
          onSearchRelated={undefined}
        />
      </div>
    </>
  );
}

function Query2Data() {
  return (
    <>
      <TopContainer>
        <h2>Step 1: Query Dataset (Poverty Estimation)</h2>
        <p>
          In this dataset, your goal is to gather data for building a regression
          model that predicts the poverty of each US state in 2016. Once you
          review the dataset below, click on the button "Evaluate Search
          Results" to go the next page.
        </p>
        <Link to="/poverty/search-results/" className="btn btn-lg btn-primary mb-2">
          Go to Step 2: Evaluate Search Results
        </Link>
      </TopContainer>
      <div className="container mt-3">
        <QueryDatasetInfoBox hit={data.usPovertyQuery} targetIndex={4} />
      </div>
    </>
  );
}

function Query2Results() {
  const { searchQuery } = mockdata;
  const searchState = SearchState.SEARCH_SUCCESS;
  const searchResponse = {
    ...data.povertyEstimationResults,
    results: aggregateResults(data.povertyEstimationResults.results).slice(
      0,
      10
    ),
  };
  return (
    <>
      <TopContainer>
        <h2>Step 2: Search Results (Poverty Estimation)</h2>
        <p>
          Bellow, is a list of datasets retrieved by a search engine that you
          could use to try to augment and improve your prediction model. Please,
          examine them and return to the survey to respond a few questions about
          them.
        </p>
      </TopContainer>
      <div className="container-fluid mt-3">
        <SearchResults
          searchQuery={searchQuery}
          searchState={searchState}
          searchResponse={searchResponse}
          onSearchRelated={undefined}
        />
      </div>
    </>
  );
}

class Experiment extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/vehicle-collisions/search-results/">
            <Query1Results />
          </Route>
          <Route path="/vehicle-collisions/data/">
            <Query1Data />
          </Route>
          <Route path="/poverty/data/">
            <Query2Data />
          </Route>
          <Route path="/poverty/search-results/">
            <Query2Results />
          </Route>
          <Route path="/">
            <LandingPage />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export { Experiment };
