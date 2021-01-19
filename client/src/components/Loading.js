import React, {Component} from "react";

export default class Loading extends Component {

    render() {
      return (
        <div class="d-flex justify-content-center mt-5 p-3">
          <div class="spinner-border" role="status"/>
        </div>
      )
    }

}