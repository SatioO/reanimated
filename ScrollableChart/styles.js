import { StyleSheet } from 'react-native';
import { spacing, width } from './utils';

export default StyleSheet.create({
  card: {
    height: 200,
    width,
    backgroundColor: '#FFF',
    margin: 10,
    borderRadius: 4,
    overflow: 'hidden',
  },
  shadow: {
    shadowColor: '#777',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.45,
    shadowRadius: 6.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    margin: spacing,
    alignItems: 'center',
  },
  dropdown: {
    backgroundColor: '#FFF',
    borderRadius: spacing,
    marginLeft: spacing,
    width: 100,
    height: spacing * 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#888',
    fontFamily: 'Gotham-Book',
    fontWeight: '500',
    fontSize: 13,
    textTransform: 'capitalize',
  },
});
