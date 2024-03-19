import React, { Component } from 'react';
import Toast from 'react-native-tiny-toast';
const WinPatterns = {
	LeftDiagonal(arr) {
		const dzpattern = [ 11, 22, 44, 55 ];
		var check1 = dzpattern.every((elem) => arr.includes(elem));
		if (check1) {
			return dzpattern;
		} else {
			Toast.show('Invalid Pattern', {
				position: Toast.position.CENTER,
				imgSource: require('../assets/images/error.png'),
				imgStyle: {
					resizeMode: 'contain',
					height: 40,
					width: 85,
					marginVertical: 10
				},
				textStyle: { fontFamily: 'Montserrat-Bold' },
				containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' }
			});
			return null;
		}
	},
	RightDiagonal(arr) {
		const dzpattern = [ 15, 24, 42, 51 ];
		var check1 = dzpattern.every((elem) => arr.includes(elem));
		if (check1) {
			return dzpattern;
		} else {
			Toast.show('Invalid Pattern', {
				position: Toast.position.CENTER,
				imgSource: require('../assets/images/error.png'),
				imgStyle: {
					resizeMode: 'contain',
					height: 40,
					width: 85,
					marginVertical: 10
				},
				textStyle: { fontFamily: 'Montserrat-Bold' },
				containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' }
			});
			return null;
		}
	},
	Corners4(arr) {
		const dzpattern = [ 11, 15, 51, 55 ];
		var check1 = dzpattern.every((elem) => arr.includes(elem));
		if (check1) {
			return dzpattern;
		} else {
			Toast.show('Invalid Pattern', {
				position: Toast.position.CENTER,
				imgSource: require('../assets/images/error.png'),
				imgStyle: {
					resizeMode: 'contain',
					height: 40,
					width: 85,
					marginVertical: 10
				},
				textStyle: { fontFamily: 'Montserrat-Bold' },
				containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' }
			});
			return null;
		}
	},
	InsideBox(arr) {
		const dzpattern = [ 22, 23, 24, 32, 34, 42, 43, 44 ];
		var check1 = dzpattern.every((elem) => arr.includes(elem));
		if (check1) {
			return dzpattern;
		} else {
			Toast.show('Invalid Pattern', {
				position: Toast.position.CENTER,
				imgSource: require('../assets/images/error.png'),
				imgStyle: {
					resizeMode: 'contain',
					height: 40,
					width: 85,
					marginVertical: 10
				},
				textStyle: { fontFamily: 'Montserrat-Bold' },
				containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' }
			});
			return null;
		}
	},
	Cross(arr) {
		const dzpattern = [ 11, 22, 44, 55, 51, 42, 24, 15 ];
		var check1 = dzpattern.every((elem) => arr.includes(elem));
		if (check1) {
			return dzpattern;
		} else {
			Toast.show('Invalid Pattern', {
				position: Toast.position.CENTER,
				imgSource: require('../assets/images/error.png'),
				imgStyle: {
					resizeMode: 'contain',
					height: 40,
					width: 85,
					marginVertical: 10
				},
				textStyle: { fontFamily: 'Montserrat-Bold' },
				containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' }
			});
			return null;
		}
	},
	Diamond(arr) {
		const dzpattern = [ 13, 22, 31, 42, 53, 44, 35, 24 ];
		var check1 = dzpattern.every((elem) => arr.includes(elem));

		if (check1) {
			return dzpattern;
		} else {
			Toast.show('Invalid Pattern', {
				position: Toast.position.CENTER,
				imgSource: require('../assets/images/error.png'),
				imgStyle: {
					resizeMode: 'contain',
					height: 40,
					width: 85,
					marginVertical: 10
				},
				textStyle: { fontFamily: 'Montserrat-Bold' },
				containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' }
			});
			return null;
		}
	},
	SmallCrossInside(arr) {
		const dzpattern = [ 23, 32, 43, 34 ];
		var check1 = dzpattern.every((elem) => arr.includes(elem));

		if (check1) {
			return dzpattern;
		} else {
			Toast.show('Invalid Pattern', {
				position: Toast.position.CENTER,
				imgSource: require('../assets/images/error.png'),
				imgStyle: {
					resizeMode: 'contain',
					height: 40,
					width: 85,
					marginVertical: 10
				},
				textStyle: { fontFamily: 'Montserrat-Bold' },
				containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' }
			});
			return null;
		}
	},
	BColumn(arr) {
		const dzpattern = [ 11, 21, 31, 41, 51 ];
		var check1 = dzpattern.every((elem) => arr.includes(elem));
		if (check1) {
			return dzpattern;
		} else {
			Toast.show('Invalid Pattern', {
				position: Toast.position.CENTER,
				imgSource: require('../assets/images/error.png'),
				imgStyle: {
					resizeMode: 'contain',
					height: 40,
					width: 85,
					marginVertical: 10
				},
				textStyle: { fontFamily: 'Montserrat-Bold' },
				containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' }
			});
			return null;
		}
	},
	IColumn(arr) {
		const dzpattern = [ 12, 22, 32, 42, 52 ];
		var check1 = dzpattern.every((elem) => arr.includes(elem));
		if (check1) {
			return dzpattern;
		} else {
			Toast.show('Invalid Pattern', {
				position: Toast.position.CENTER,
				imgSource: require('../assets/images/error.png'),
				imgStyle: {
					resizeMode: 'contain',
					height: 40,
					width: 85,
					marginVertical: 10
				},
				textStyle: { fontFamily: 'Montserrat-Bold' },
				containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' }
			});
			return null;
		}
	},
	NColumn(arr) {
		const dzpattern = [ 13, 23, 43, 53 ];
		var check1 = dzpattern.every((elem) => arr.includes(elem));
		if (check1) {
			return dzpattern;
		} else {
			Toast.show('Invalid Pattern', {
				position: Toast.position.CENTER,
				imgSource: require('../assets/images/error.png'),
				imgStyle: {
					resizeMode: 'contain',
					height: 40,
					width: 85,
					marginVertical: 10
				},
				textStyle: { fontFamily: 'Montserrat-Bold' },
				containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' }
			});
			return null;
		}
	},
	GColumn(arr) {
		const dzpattern = [ 14, 24, 34, 44, 54 ];
		var check1 = dzpattern.every((elem) => arr.includes(elem));
		if (check1) {
			return dzpattern;
		} else {
			Toast.show('Invalid Pattern', {
				position: Toast.position.CENTER,
				imgSource: require('../assets/images/error.png'),
				imgStyle: {
					resizeMode: 'contain',
					height: 40,
					width: 85,
					marginVertical: 10
				},
				textStyle: { fontFamily: 'Montserrat-Bold' },
				containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' }
			});
			return null;
		}
	},
	OColumn(arr) {
		const dzpattern = [ 15, 25, 35, 45, 55 ];
		var check1 = dzpattern.every((elem) => arr.includes(elem));
		if (check1) {
			return dzpattern;
		} else {
			Toast.show('Invalid Pattern', {
				position: Toast.position.CENTER,
				imgSource: require('../assets/images/error.png'),
				imgStyle: {
					resizeMode: 'contain',
					height: 40,
					width: 85,
					marginVertical: 10
				},
				textStyle: { fontFamily: 'Montserrat-Bold' },
				containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' }
			});
			return null;
		}
	},
	FirstRow(arr) {
		var hzpattern = [ 11, 12, 13, 14, 15 ];
		var check = hzpattern.every((elem) => arr.includes(elem));
		if (check) {
			return hzpattern;
		} else {
			Toast.show('Invalid Pattern', {
				position: Toast.position.CENTER,
				imgSource: require('../assets/images/error.png'),
				imgStyle: {
					resizeMode: 'contain',
					height: 40,
					width: 85,
					marginVertical: 10
				},
				textStyle: { fontFamily: 'Montserrat-Bold' },
				containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' }
			});
		}
	},
	SecondRow(arr) {
		var hzpattern = [ 21, 22, 23, 24, 25 ];
		var check = hzpattern.every((elem) => arr.includes(elem));
		if (check) {
			return hzpattern;
		} else {
			Toast.show('Invalid Pattern', {
				position: Toast.position.CENTER,
				imgSource: require('../assets/images/error.png'),
				imgStyle: {
					resizeMode: 'contain',
					height: 40,
					width: 85,
					marginVertical: 10
				},
				textStyle: { fontFamily: 'Montserrat-Bold' },
				containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' }
			});
		}
	},
	ThirdRow(arr) {
		var hzpattern = [ 31, 32, 34, 35 ];
		var check = hzpattern.every((elem) => arr.includes(elem));
		if (check) {
			return hzpattern;
		} else {
			Toast.show('Invalid Pattern', {
				position: Toast.position.CENTER,
				imgSource: require('../assets/images/error.png'),
				imgStyle: {
					resizeMode: 'contain',
					height: 40,
					width: 85,
					marginVertical: 10
				},
				textStyle: { fontFamily: 'Montserrat-Bold' },
				containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' }
			});
		}
	},
	FourthRow(arr) {
		var hzpattern = [ 41, 42, 43, 44, 45 ];
		var check = hzpattern.every((elem) => arr.includes(elem));
		if (check) {
			return hzpattern;
		} else {
			Toast.show('Invalid Pattern', {
				position: Toast.position.CENTER,
				imgSource: require('../assets/images/error.png'),
				imgStyle: {
					resizeMode: 'contain',
					height: 40,
					width: 85,
					marginVertical: 10
				},
				textStyle: { fontFamily: 'Montserrat-Bold' },
				containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' }
			});
		}
	},
	FifthRow(arr) {
		var hzpattern = [ 51, 52, 53, 54, 55 ];
		var check = hzpattern.every((elem) => arr.includes(elem));
		if (check) {
			return hzpattern;
		} else {
			Toast.show('Invalid Pattern', {
				position: Toast.position.CENTER,
				imgSource: require('../assets/images/error.png'),
				imgStyle: {
					resizeMode: 'contain',
					height: 40,
					width: 85,
					marginVertical: 10
				},
				textStyle: { fontFamily: 'Montserrat-Bold' },
				containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' }
			});
		}
	},
	Crucifix(arr) {
		const dzpattern = [ 13, 23, 43, 53, 31, 32, 34, 35 ];
		var check1 = dzpattern.every((elem) => arr.includes(elem));

		if (check1) {
			return dzpattern;
		} else {
			Toast.show('Invalid Pattern', {
				position: Toast.position.CENTER,
				imgSource: require('../assets/images/error.png'),
				imgStyle: {
					resizeMode: 'contain',
					height: 40,
					width: 85,
					marginVertical: 10
				},
				textStyle: { fontFamily: 'Montserrat-Bold' },
				containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' }
			});
			return null;
		}
	},
	Boxof4UpperLeft(arr) {
		const dzpattern = [ 11, 12, 21, 22 ];
		var check1 = dzpattern.every((elem) => arr.includes(elem));
		if (check1) {
			return dzpattern;
		} else {
			Toast.show('Invalid Pattern', {
				position: Toast.position.CENTER,
				imgSource: require('../assets/images/error.png'),
				imgStyle: {
					resizeMode: 'contain',
					height: 40,
					width: 85,
					marginVertical: 10
				},
				textStyle: { fontFamily: 'Montserrat-Bold' },
				containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' }
			});
			return null;
		}
	},
	Boxof4UpperRight(arr) {
		const dzpattern = [ 14, 15, 24, 25 ];
		var check1 = dzpattern.every((elem) => arr.includes(elem));
		if (check1) {
			return dzpattern;
		} else {
			Toast.show('Invalid Pattern', {
				position: Toast.position.CENTER,
				imgSource: require('../assets/images/error.png'),
				imgStyle: {
					resizeMode: 'contain',
					height: 40,
					width: 85,
					marginVertical: 10
				},
				textStyle: { fontFamily: 'Montserrat-Bold' },
				containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' }
			});
			return null;
		}
	},
	Boxof4LowerLeft(arr) {
		const dzpattern = [ 41, 42, 51, 52 ];
		var check1 = dzpattern.every((elem) => arr.includes(elem));
		if (check1) {
			return dzpattern;
		} else {
			Toast.show('Invalid Pattern', {
				position: Toast.position.CENTER,
				imgSource: require('../assets/images/error.png'),
				imgStyle: {
					resizeMode: 'contain',
					height: 40,
					width: 85,
					marginVertical: 10
				},
				textStyle: { fontFamily: 'Montserrat-Bold' },
				containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' }
			});
			return null;
		}
	},
	Boxof4LowerRight(arr) {
		const dzpattern = [ 44, 45, 54, 55 ];
		var check1 = dzpattern.every((elem) => arr.includes(elem));
		if (check1) {
			return dzpattern;
		} else {
			Toast.show('Invalid Pattern', {
				position: Toast.position.CENTER,
				imgSource: require('../assets/images/error.png'),
				imgStyle: {
					resizeMode: 'contain',
					height: 40,
					width: 85,
					marginVertical: 10
				},
				textStyle: { fontFamily: 'Montserrat-Bold' },
				containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' }
			});
			return null;
		}
	},
	Boxof9UpperLeft(arr) {
		const dzpattern = [ 11, 12, 13, 21, 22, 23, 31, 32 ];
		var check1 = dzpattern.every((elem) => arr.includes(elem));
		if (check1) {
			return dzpattern;
		} else {
			Toast.show('Invalid Pattern', {
				position: Toast.position.CENTER,
				imgSource: require('../assets/images/error.png'),
				imgStyle: {
					resizeMode: 'contain',
					height: 40,
					width: 85,
					marginVertical: 10
				},
				textStyle: { fontFamily: 'Montserrat-Bold' },
				containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' }
			});
			return null;
		}
	},
	Boxof9UpperRight(arr) {
		const dzpattern = [ 13, 14, 15, 23, 24, 25, 34, 35 ];
		var check1 = dzpattern.every((elem) => arr.includes(elem));
		if (check1) {
			return dzpattern;
		} else {
			Toast.show('Invalid Pattern', {
				position: Toast.position.CENTER,
				imgSource: require('../assets/images/error.png'),
				imgStyle: {
					resizeMode: 'contain',
					height: 40,
					width: 85,
					marginVertical: 10
				},
				textStyle: { fontFamily: 'Montserrat-Bold' },
				containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' }
			});
			return null;
		}
	},
	Boxof9LowerLeft(arr) {
		const dzpattern = [ 31, 32, 41, 42, 43, 51, 52, 53 ];
		var check1 = dzpattern.every((elem) => arr.includes(elem));
		if (check1) {
			return dzpattern;
		} else {
			Toast.show('Invalid Pattern', {
				position: Toast.position.CENTER,
				imgSource: require('../assets/images/error.png'),
				imgStyle: {
					resizeMode: 'contain',
					height: 40,
					width: 85,
					marginVertical: 10
				},
				textStyle: { fontFamily: 'Montserrat-Bold' },
				containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' }
			});
			return null;
		}
	},
	Boxof9LowerRight(arr) {
		const dzpattern = [ 34, 35, 43, 44, 53, 45, 54, 55 ];
		var check1 = dzpattern.every((elem) => arr.includes(elem));
		if (check1) {
			return dzpattern;
		} else {
			Toast.show('Invalid Pattern', {
				position: Toast.position.CENTER,
				imgSource: require('../assets/images/error.png'),
				imgStyle: {
					resizeMode: 'contain',
					height: 40,
					width: 85,
					marginVertical: 10
				},
				textStyle: { fontFamily: 'Montserrat-Bold' },
				containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' }
			});
			return null;
		}
	},
	ShadedUpperLeft(arr) {
		const dzpattern = [ 11, 12, 13, 14, 15, 21, 22, 23, 24, 31, 32, 41, 42, 51 ];
		var check1 = dzpattern.every((elem) => arr.includes(elem));
		if (check1) {
			return dzpattern;
		} else {
			Toast.show('Invalid Pattern', {
				position: Toast.position.CENTER,
				imgSource: require('../assets/images/error.png'),
				imgStyle: {
					resizeMode: 'contain',
					height: 40,
					width: 85,
					marginVertical: 10
				},
				textStyle: { fontFamily: 'Montserrat-Bold' },
				containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' }
			});
			return null;
		}
	},
	ShadedLowerLeft(arr) {
		const dzpattern = [ 11, 21, 22, 31, 32, 41, 42, 43, 44, 51, 52, 53, 54, 55 ];
		var check1 = dzpattern.every((elem) => arr.includes(elem));
		if (check1) {
			return dzpattern;
		} else {
			Toast.show('Invalid Pattern', {
				position: Toast.position.CENTER,
				imgSource: require('../assets/images/error.png'),
				imgStyle: {
					resizeMode: 'contain',
					height: 40,
					width: 85,
					marginVertical: 10
				},
				textStyle: { fontFamily: 'Montserrat-Bold' },
				containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' }
			});
			return null;
		}
	},
	ShadedUpperRight(arr) {
		const dzpattern = [ 11, 12, 13, 14, 15, 22, 23, 24, 25, 34, 35, 44, 45, 55 ];
		var check1 = dzpattern.every((elem) => arr.includes(elem));
		if (check1) {
			return dzpattern;
		} else {
			Toast.show('Invalid Pattern', {
				position: Toast.position.CENTER,
				imgSource: require('../assets/images/error.png'),
				imgStyle: {
					resizeMode: 'contain',
					height: 40,
					width: 85,
					marginVertical: 10
				},
				textStyle: { fontFamily: 'Montserrat-Bold' },
				containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' }
			});
			return null;
		}
	},
	ShadedLowerRight(arr) {
		const dzpattern = [ 15, 24, 25, 34, 35, 42, 43, 44, 45, 51, 52, 53, 54, 55 ];
		var check1 = dzpattern.every((elem) => arr.includes(elem));
		if (check1) {
			return dzpattern;
		} else {
			Toast.show('Invalid Pattern', {
				position: Toast.position.CENTER,
				imgSource: require('../assets/images/error.png'),
				imgStyle: {
					resizeMode: 'contain',
					height: 40,
					width: 85,
					marginVertical: 10
				},
				textStyle: { fontFamily: 'Montserrat-Bold' },
				containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' }
			});
			return null;
		}
	},

	TwoRowsTopBottom(arr) {
		var hzpattern = [ 11, 12, 13, 14, 15, 51, 52, 53, 54, 55 ];

		var check = hzpattern.every((elem) => arr.includes(elem));

		if (check) {
			return hzpattern;
		} else {
			Toast.show('Invalid Pattern', {
				position: Toast.position.CENTER,
				imgSource: require('../assets/images/error.png'),
				imgStyle: {
					resizeMode: 'contain',
					height: 40,
					width: 85,
					marginVertical: 10
				},
				textStyle: { fontFamily: 'Montserrat-Bold' },
				containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' }
			});
		}
	},
	TwoRowsMid(arr) {
		var hzpattern = [ 21, 22, 23, 24, 25, 41, 42, 43, 44, 45 ];
		var check = hzpattern.every((elem) => arr.includes(elem));
		if (check) {
			return hzpattern;
		} else {
			Toast.show('Invalid Pattern', {
				position: Toast.position.CENTER,
				imgSource: require('../assets/images/error.png'),
				imgStyle: {
					resizeMode: 'contain',
					height: 40,
					width: 85,
					marginVertical: 10
				},
				textStyle: { fontFamily: 'Montserrat-Bold' },
				containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' }
			});
		}
	},
	ThreeRowsShaded(arr) {
		const hzpattern = [ 11, 12, 13, 14, 15, 31, 32, 34, 35, 51, 52, 53, 54, 55 ];
		var check = hzpattern.every((elem) => arr.includes(elem));
		if (check) {
			return hzpattern;
		} else {
			Toast.show('Invalid Pattern', {
				position: Toast.position.CENTER,
				imgSource: require('../assets/images/error.png'),
				imgStyle: {
					resizeMode: 'contain',
					height: 40,
					width: 85,
					marginVertical: 10
				},
				textStyle: { fontFamily: 'Montserrat-Bold' },
				containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' }
			});
		}
	},
	TwoColumnsShadedBAndO(arr) {
		const hzpattern = [ 11, 21, 31, 41, 51, 15, 25, 35, 45, 55 ];
		var check = hzpattern.every((elem) => arr.includes(elem));
		if (check) {
			return hzpattern;
		} else {
			Toast.show('Invalid Pattern', {
				position: Toast.position.CENTER,
				imgSource: require('../assets/images/error.png'),
				imgStyle: {
					resizeMode: 'contain',
					height: 40,
					width: 85,
					marginVertical: 10
				},
				textStyle: { fontFamily: 'Montserrat-Bold' },
				containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' }
			});
		}
	},
	TwoColumnsShadedIAndG(arr) {
		const hzpattern = [ 12, 22, 32, 42, 52, 14, 24, 34, 44, 54 ];

		var check = hzpattern.every((elem) => arr.includes(elem));

		if (check) {
			return hzpattern;
		} else {
			Toast.show('Invalid Pattern', {
				position: Toast.position.CENTER,
				imgSource: require('../assets/images/error.png'),
				imgStyle: {
					resizeMode: 'contain',
					height: 40,
					width: 85,
					marginVertical: 10
				},
				textStyle: { fontFamily: 'Montserrat-Bold' },
				containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' }
			});
		}
	},

	BlackOut(arr) {
		const hzpattern = [
			11,
			12,
			13,
			14,
			15,
			21,
			22,
			23,
			24,
			25,
			31,
			32,
			34,
			35,
			41,
			42,
			43,
			44,
			45,
			51,
			52,
			53,
			54,
			55
		];
		var check = hzpattern.every((elem) => arr.includes(elem));
		if (check) {
			return hzpattern;
		} else {
			Toast.show('Invalid Pattern', {
				position: Toast.position.CENTER,
				imgSource: require('../assets/images/error.png'),
				imgStyle: {
					resizeMode: 'contain',
					height: 40,
					width: 85,
					marginVertical: 10
				},
				textStyle: { fontFamily: 'Montserrat-Bold' },
				containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)' }
			});
		}
	}
};

export { WinPatterns };
