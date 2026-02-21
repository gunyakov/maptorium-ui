export default {
  request: {
    timeout: 'Запрос $ был прерван из-за истечения времени ожидания.',
  },
  menu: {
    maps: 'Карты',
    layers: 'Слои',
    view: {
      root: 'Вид',
      tile_grid: 'Сетка тайлов',
      clear_tile_grid: 'Убрать сетку тайлов',
    },
    draw: {
      root: 'Рисование',
      point: 'Точка',
      polyline: 'Полилиния',
      polygon: 'Полигон',
      tile_square: 'Квадрат тайла',
      controls: {
        save: 'Сохранить',
        delete: 'Удалить',
        cancel: 'Отмена',
      },
      context: {
        properties: 'Свойства...',
        move: 'Переместить',
        edit: 'Редактировать',
        delete: 'Удалить',
      },
      measure: {
        title: 'Измерения',
        name: 'Имя',
        total: 'Итого',
        area: 'Площадь',
      },
    },
    gps: {
      root: 'GPS',
      service: 'GPS сервис',
      start: 'Запуск',
      options: 'Опции...',

      route: {
        menu: 'Маршрут',
        new: 'Начать новый маршрут...',
        record: 'Запись',
        show: 'Показать на карте',
        sample_time: 'Время выборки',
        distance_go: 'Остаток пути...',
        from_file: 'Загрузить маршрут из файла...',
      },
      history: {
        menu: 'История',
        clean: 'Очистить историю',
      },
      follow: 'Следить за позицией GPS',
      center: 'Центрировать на позиции GPS',
      add_marker: 'Добавить маркер на позиции GPS',
    },
    file: {
      root: 'Файл',
      preferences: {
        root: 'Настройки',
        language: 'Язык',
        network_mode: {
          root: 'Режим сети',
          enable: 'Включить',
          disable: 'Отключить',
          force: 'Принудительно',
        },
        gb: 'Английский',
        ru: 'Русский',
      },
      quit: 'Выйти',
    },
  },
  txt: {
    gps: {
      type: {
        label: 'Тип GPS',
        tcp: 'TCP',
        usb: 'USB',
      },
      sample_time: 'Введите время выборки GPS, сек:',
      started: 'Сервис GPS запущен.',
      stopped: 'Сервис GPS остановлен.',
      enable_recording: 'Включить запись маршрута',
      disable_recording: 'Отключить запись маршрута',
      new_route_started: 'Новый маршрут начат.',
      sample_time_updated: 'Время выборки GPS обновлено.',
      error: {
        start: 'Ошибка при запуске сервиса GPS, проверьте настройки.',
        stop: 'Ошибка при остановке сервиса GPS.',
        disable_recording: 'Ошибка при отключении записи маршрута.',
        enable_recording: 'Ошибка при включении записи маршрута.',
        new_route: 'Ошибка при запуске нового маршрута.',
        invalid_route_name: 'Ошибка: имя маршрута слишком короткое.',
        empty_route_list: 'Нет маршрутов в истории.',
        sample_time_update: 'Ошибка при обновлении времени выборки GPS.',
        invalid_sample_time: 'Невозможно прочитать значение времени. Пропуск.',
        route_not_found: 'Невозможно найти данные маршрута в базе данных.',
        no_last_point: 'Невозможно получить последнюю точку маршрута. Результат пуст.',
      },
    },
  },
  dialog: {
    actions: {
      ok: 'ОК',
      cancel: 'Отмена',
    },
    gps: {
      config: {
        title: 'Настройки GPS',
        host: 'Хост',
        port: 'Порт',
        device: 'Устройство',
      },
      route_from_file: {
        title: 'Маршрут из файла',
      },
      distance_to_go: {
        title: 'Расстояние до пункта назначения:',
        descr: 'Введите расстояние до пункта назначения',
        units: 'Единицы измерения',
        square_units: 'Единицы площади',
      },
      route_new_name: {
        title: 'Новое имя маршрута',
        descr: 'Введите имя для нового маршрута. Оно будет использоваться в списке истории.',
      },
    },
    cached_map: {
      main: {
        title: 'Карта кешированных тайлов',
      },
    },
    poi: {
      properties: {
        title: 'Свойства POI',
      },
    },
    category: {
      properties: {
        title: 'Свойства категории',
      },
    },
  },
  distance: {
    units: {
      meter: 'метры',
      kilometer: 'километры',
      mile: 'мили',
      nmile: 'морские мили',
      yard: 'ярды',
      foot: 'футы',
    },
    square_units: {
      hectare: 'гектары',
      decare: 'декары',
      are: 'ары',
    },
  },
};
