/**
 *
 *
 * InputFile
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';

import InputFileDetails from '../InputFileDetails';

import './styles.scss';

class InputFile extends React.Component {
  state = {
    didDeleteFile: false,
    isUploading: false,
    position: 0,
  };

  addFilesToProps = (files) => {
    const initAcc = this.props.multiple ? cloneDeep(this.props.value) : {};
    const value = Object.keys(files).reduce((acc, current) => {

      if (this.props.multiple) {
        acc.push(files[current]);
      } else if (current === '0') {
        acc[0] = files[0];
      }

      return acc;
    }, initAcc)

    const target = {
      name: this.props.name,
      type: 'file',
      value,
    };

    this.setState({ isUploading: !this.state.isUploading });
    this.props.onChange({ target });
  }

  handleChange = ({ target }) => this.addFilesToProps(target.files);

  handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.refs.inputFile.click();
  }

  onDrop = (e) => {
    e.preventDefault();
    this.addFilesToProps(e.dataTransfer.files);
  }

  handleFileDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Remove the file from props
    const value = this.props.multiple ? cloneDeep(this.props.value) : {};

    // Remove the file from the array if multiple files upload is enable
    if (this.props.multiple) {
      value.splice(this.state.position, 1);
    }
    // Update the parent's props
    const target = {
      name: this.props.name,
      type: 'file',
      value,
    };

    this.props.onChange({ target });

    // Update the position of the children
    if (this.props.multiple) {
      const newPosition = value.length === 0 ? 0 : value.length - 1;
      this.updateFilePosition(newPosition, value.length);
    }
    this.setState({ didDeleteFile: !this.state.didDeleteFile });
  }

  updateFilePosition = (newPosition, size = this.props.value.length) => {
    const label = size === 0 ? false : newPosition + 1;
    this.props.setLabel(label);
    this.setState({ position: newPosition });
  }

  render() {
    const {
      multiple,
      name,
      onChange,
      value,
    } = this.props;

    return (
      <div>
       
        <label style={{ width: '100%'}}>
          <input
            className="inputFile"
            multiple={multiple}
            name={name}
            onChange={this.handleChange}
            type="file"
            ref="inputFile"
          />

          <div className="inputFileButtonContainer">
            <i className="fa fa-plus" style={{ marginRight: '10px', marginBottom: '2px' }} />
            <span style={{ fontSize: '12px' }}>ADD A NEW FILE</span>
          </div>
        </label>
        <InputFileDetails
          file={value[this.state.position] || value[0] || value}
          multiple={multiple}
          number={value.length}
          onFileDelete={this.handleFileDelete}
        />
      </div>
    );
  }
}

InputFile.defaultProps = {
  multiple: false,
  setLabel: () => {},
  value: [],
};

InputFile.propTypes = {
  multiple: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  setLabel: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
};

export default InputFile;
