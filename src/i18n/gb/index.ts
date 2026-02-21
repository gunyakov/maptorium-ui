export default {
  request: {
    timeout: 'Request $ was aborted due to timeout.',
  },
  menu: {
    maps: 'Maps',
    layers: 'Layers',
    view: {
      root: 'View',
      tile_grid: 'Tile Grid',
      clear_tile_grid: 'Remove Tile Grid',
    },
    draw: {
      root: 'Draw',
      point: 'Point',
      polyline: 'Polyline',
      polygon: 'Polygon',
      tile_square: 'Tile square',
      controls: {
        save: 'Save',
        delete: 'Delete',
        cancel: 'Cancel',
      },
      context: {
        properties: 'Properties...',
        move: 'Move',
        edit: 'Edit',
        delete: 'Delete',
      },
      measure: {
        title: 'Measure',
        name: 'Name',
        total: 'Total',
        area: 'Area',
      },
    },
    gps: {
      root: 'GPS',
      service: 'GPS service',
      start: 'Start',
      options: 'Options...',
      route: {
        menu: 'Route',
        new: 'Start new route...',
        record: 'Record',
        show: 'Show on map',
        sample_time: 'Sample time',
        distance_go: 'Distance to go...',
        from_file: 'Load route from file...',
      },
      history: {
        menu: 'History',
        clean: 'Clean history',
      },
      follow: 'Follow GPS Position',
      center: 'Center on GPS Position',
      add_marker: 'Add marker at GPS Position',
    },
    file: {
      root: 'File',
      preferences: {
        root: 'Preferences',
        language: 'Language',
        network_mode: {
          root: 'Network Mode',
          enable: 'Enable',
          disable: 'Disable',
          force: 'Force',
        },
        gb: 'English',
        ru: 'Russian',
      },
      quit: 'Quit',
    },
  },
  txt: {
    gps: {
      type: {
        label: 'GPS Type',
        tcp: 'TCP',
        usb: 'USB',
      },
      sample_time: 'Enter GPS sample time, sec:',
      started: 'GPS Service started.',
      stopped: 'GPS Service stopped.',
      enable_recording: 'Enable recording route',
      disable_recording: 'Disable recording route',
      new_route_started: 'New route started.',
      sample_time_updated: 'GPS sample time updated.',
      error: {
        start: 'Error to start GPS Service, check settings.',
        stop: 'Error to stop GPS Service.',
        disable_recording: 'Error to disable recording route.',
        enable_recording: 'Error to enable recording route.',
        new_route: 'Error to start new route.',
        invalid_route_name: 'Error: Route name is too short.',
        empty_route_list: 'No routes in history.',
        sample_time_update: 'Error to update GPS route sample time.',
        invalid_sample_time: 'Cant read time value. Skip.',
        route_not_found: 'Cant find route data in DB.',
        no_last_point: 'Cant get last route point. Result is empty now.',
      },
    },
  },
  dialog: {
    actions: {
      ok: 'OK',
      cancel: 'Cancel',
    },
    gps: {
      config: {
        title: 'GPS Settings',
        host: 'Host',
        port: 'Port',
        device: 'Device',
      },
      route_from_file: {
        title: 'Route from file',
      },
      distance_to_go: {
        title: 'Distance to destination:',
        descr: 'Enter distance to destination',
        units: 'Units',
        square_units: 'Square measurements',
      },
      route_new_name: {
        title: 'New route name',
        descr: 'Enter name for new route. It will be used in history list.',
      },
    },
    cached_map: {
      main: {
        title: 'Tiles cached map',
      },
    },
    poi: {
      properties: {
        title: 'POI Properties',
      },
    },
    category: {
      properties: {
        title: 'Category Properties',
      },
    },
  },
  distance: {
    units: {
      meter: 'meters',
      kilometer: 'kilometers',
      mile: 'miles',
      nmile: 'nautical miles',
      yard: 'yards',
      foot: 'feet',
    },
    square_units: {
      hectare: 'hectares',
      decare: 'decares',
      are: 'ares',
    },
  },
};
