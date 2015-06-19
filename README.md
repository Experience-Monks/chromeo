# chromeo

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

experimental Node-Browser bridge

##### work in progress

a lot of this code will eventually be shared by budo / hihat since they are doing some similar things

main use cases:

- writing tests that need to operate on both Node and Browser code
  - e.g. testing a HTMLImageElement loader by serving your own images with `http` module
- easier way to test and develop typical node modules
  - debugger, breakpoints, etc
- moar cool stuff

## Usage

[![NPM](https://nodei.co/npm/chromeo.png)](https://www.npmjs.com/package/chromeo)

## See Also

- [smokestack](https://www.npmjs.com/package/smokestack) - autonomous browserify testing
- [hihat](https://www.npmjs.com/package/hihat) - interactive browserify testing
- [budo](https://www.npmjs.com/package/budo) - browserify development server

## License

MIT, see [LICENSE.md](http://github.com/Jam3/chromeo/blob/master/LICENSE.md) for details.
