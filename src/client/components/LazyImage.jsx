import React, { Component } from 'react'
import 'whatwg-fetch'

export default class LazyImage extends Component {
  constructor(props) {
    super(props)
    this.state = {img: null}
  }
  render() {
    const src = this.state.img || this.props.placeholder
    return (
      <img src={src} style={this.props.styles.img} />
    )
  }
  componentDidMount() {
    fetch(this.props.url, this.props.fetchOpts)
    .then(res => res.json())
    .then(json => this.props.jsonReducer(json))
    .then(img => this.setState({img}))
  }
}

LazyImage.propTypes = {
  url: React.PropTypes.string,
  fetchOpts: React.PropTypes.object,
  jsonReducer: React.PropTypes.func,
  styles: React.PropTypes.object.isRequired,
  placeholder: React.PropTypes.string
}

LazyImage.defaultProps = {
  placeholder: 'public/camera.png',
  styles: {
    img: {
      width: '3.8em'
    }
  }
}
