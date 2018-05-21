import React, { Component } from 'react';
import axios from "axios";
import Dropzone from "react-dropzone";

import logo from './logo.svg';
import './App.css';

class App extends Component {


  constructor(props) {
    super(props);

    this.state = {
      isDropzoneActive: false,
    }
  }

  onDragEnter = () => {
    this.setState({
      isDropzoneActive: true,
    })
  }

  onDragLeave = () => {
    this.setState({
      isDropzoneActive: false,
    })
  }


  onDrop = (files) => {
    
    const API_URL = "http://localhost:1337/api/v1"

    try {

      const url = `${API_URL}/media`;
      const method = 'POST';

      // because of react dropzone is using multiple input file, 
      // I decided to loop all file and POST it one by one async. 
      // this also make me possible to track the upload progress (I need this feature).
      files.map((file, index) => {

        let formData = new FormData();

        // I know that structur or order of formData affect multipart request.
        // I move file upload below the form request.
        formData.append('dir', '/test');
        formData.append("fileUpload", file);

        let config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          //onUploadProgress: progressEvent => this.myUploadProgress(progressEvent, file),
        }

        // Common approach to upload using axios.
        axios.post(url, formData, config).then((newData) => {

          this.setState((prevState, props) => {
            return {
              isDropzoneActive: false,
              // files: [...prevState.files, ...newData.data.files]
            }
          });
        })

      })

    } catch (err) {
      console.log('error upload image', err);
    }

  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>

        <Dropzone
          disableClick
          ref={(node) => { this.dropzoneRef = node; }}
          onDrop={this.onDrop}
          onDragEnter={this.onDragEnter.bind(this)}
          onDragLeave={this.onDragLeave.bind(this)}
          style={{ position: "relative", flex: '1', width: '100vw', height: '100vh' }} >

          {this.state.isDropzoneActive && <div>Drop files...</div>}

          <p style={{ marginBottom: '2rem', opacity: '.7' }}><span className="ti-info-alt" /> Tips: Try dropping some files here / below. (100MB max)</p>

        </Dropzone>
      </div>
    );
  }
}

export default App;
