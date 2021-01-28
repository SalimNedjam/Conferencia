import React, {Component} from "react";

class Button extends Component {

  render() {
    if (this.props.loading) {
      return (
        <button
          type="button"
          disabled
          class={this.props.class}>
          <div class="d-flex align-items-center justify-content-center">
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            &nbsp;Chargement...
          </div>
        </button>
      );
    } else { 
      return (
        <button
          disabled={this.props.disabled}
          class={this.props.class}
          name={this.props.name}
          onClick={this.props.onClick}>
          {this.props.title}
        </button>
      );
    }
  }
}

export default Button;