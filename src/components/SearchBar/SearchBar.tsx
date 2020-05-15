import './SearchBar.css';
import React from 'react';
import * as Icon from 'react-feather';
import { PersistentComponent } from '../visus/PersistentComponent/PersistentComponent';

interface SearchBarProps {
  active: boolean;
  value: string;
  onQueryChange: (query: string) => void;
  onSubmitQuery: () => void;
}

class SearchBar extends PersistentComponent<SearchBarProps> {
  constructor(props: SearchBarProps) {
    super(props);
    this.state = { value: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  isActive() {
    return this.props.active || this.props.value !== '';
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;
    this.props.onQueryChange(query);
  }

  handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    this.props.onSubmitQuery();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="input-group SearchBar">
          <input
            type="text"
            className="form-control SearchBar-input"
            value={this.props.value}
            onChange={this.handleChange}
          />
          <div
            className="input-group-append"
            onClick={() => this.props.onSubmitQuery()}
          >
            <span
              className={`input-group-text SearchBar-icon${
                this.isActive() ? ' SearchBar-icon-active' : ''
              }`}
            >
              <Icon.Search className="feather" />
            </span>
          </div>
        </div>
      </form>
    );
  }
}

export { SearchBar };
