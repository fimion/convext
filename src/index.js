import cuid from "cuid"


export default function(key, value) {

  let baseID = cuid(),
    setKey = key + "Setter-"+baseID,
    getKey = key + "Getter-" + baseID,
    nameKey = key + '-' + baseID;

  let provideMixin = {
    data() {
      return {
        [nameKey]: value,
      };
    },
    methods: {
      [getKey]: function() {
        return this[nameKey];
      },
      [setKey]: function(data) {
        this[nameKey] = data;
      }
    },
    computed: {
      [key]: {
        get() {
          return this[getKey]();
        },
        set(data) {
          this[setKey](data);
        }
      }
    },
    provide() {
      return {
        [setKey]:this[setKey],
        [getKey]:this[getKey],
      };
    }
  };
  let injectMixin = {
    inject: [getKey, setKey],
    computed: {
      [key]: {
        get() {
          return this[getKey]();
        },
        set(data) {
          this[setKey](data);
        }
      },
      [nameKey]: {
        get() {
          return this[getKey]();
        },
        set(data) {
          this[setKey](data);
        }
      }
    }
  };

  return {
    baseID,
    getKey,
    setKey,
    nameKey,
    provideMixin,
    injectMixin,
  };
}