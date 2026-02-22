export default {
  request: {
    timeout: 'Запрос $ был прерван из-за истечения времени ожидания.',
    job: {
      list: {
        empty: 'Список задач пуст.',
      },
      download: {
        added: 'Задача добавлена в очередь.',
      },
      generate: {
        added: 'Задача генерации добавлена в очередь.',
      },
      start: {
        success: 'Задача запущена.',
      },
      stop: {
        success: 'Задача остановлена.',
      },
      up: {
        success: 'Задача перемещена вверх в очереди.',
        failed: 'Невозможно переместить задачу вверх в очереди.',
      },
      down: {
        success: 'Задача перемещена вниз в очереди.',
        failed: 'Невозможно переместить задачу вниз в очереди.',
      },
      delete: {
        success: 'Задача удалена из очереди.',
        failed: 'Невозможно удалить задачу из очереди.',
      },
      queue: {
        job_not_found: 'Невозможно найти задачу в очереди по ID. Пропуск.',
      },
      validation: {
        body_invalid: 'Некорректное тело запроса. Задача не добавлена в очередь.',
        download_invalid: 'Некорректная конфигурация загрузки. Задача не добавлена в очередь.',
        polygon_invalid: 'Некорректные точки полигона. Задача не добавлена в очередь.',
        custom_network_invalid: 'customNetworkConfig должен быть boolean.',
        network_invalid: 'Некорректная сетевая конфигурация. Задача не добавлена в очередь.',
        map_handler_missing: 'Невозможно найти обработчик карты по map ID. Пропуск.',
        generate_id_invalid: 'Некорректный ID задачи генерации. Задача не добавлена в очередь.',
        map_id_invalid: 'Некорректный map ID. Задача не добавлена в очередь.',
        zoom_empty: 'Список зумов пуст.',
        zoom_invalid: 'Список зумов содержит некорректные значения.',
        from_zoom_invalid: 'Некорректное базовое значение зума.',
        generate_flags_invalid: 'Некорректные флаги генерации. Задача не добавлена в очередь.',
        generate_zoom_relation_invalid: 'Генерируемые зумы должны быть меньше базового зума.',
      },
    },
    core: {
      default: {
        updated: 'Конфигурация по умолчанию обновлена.',
        updated_with_save_warning:
          'Конфигурация по умолчанию обновлена, но сохранение завершилось с предупреждениями.',
        api_keys: {
          map_id_read_failed: 'Невозможно прочитать map ID из запроса.',
          map_id_missing: 'Map ID отсутствует в списке карт. Проверьте map ID.',
        },
      },
      mode: {
        updated: 'Режим сети обновлён.',
        updated_with_save_warning:
          'Режим сети изменён, но сохранение завершилось с предупреждениями.',
      },
      map_storage: {
        map_id_missing: 'Map ID отсутствует.',
        path_missing: 'Путь хранения не указан.',
        path_invalid: 'Выбранный путь некорректен или не является папкой.',
        update_failed: 'Не удалось обновить путь хранения карты.',
        updated: 'Путь хранения карты обновлён.',
      },
    },
    map: {
      cached: {
        poi_id_invalid: 'Невозможно прочитать POI ID. Отмена расчёта тайлов.',
        zoom_invalid: 'Ошибка чтения значения зума. Отмена расчёта тайлов.',
        map_handler_missing:
          'Невозможно получить обработчик карты по map ID. Отмена расчёта тайлов.',
        poi_not_found: 'Невозможно найти POI в БД. Отмена расчёта тайлов.',
        poi_not_polygon: 'Отмена расчёта тайлов. Тип POI не Polygon.',
        build_started: 'Построение карты кеша запущено. Дождитесь результата.',
        build_canceled: 'Построение карты кеша отменено.',
        cleaned: 'Карта кешированных тайлов очищена из памяти.',
      },
    },
    poi: {
      category: {
        list_empty: 'Список категорий пуст.',
        add: {
          success: 'Категория добавлена в БД.',
          failed: 'Ошибка при добавлении категории в БД.',
        },
        update: {
          success: 'Категория обновлена в БД.',
          failed: 'Ошибка при обновлении категории в БД.',
        },
        delete: {
          success: 'Категория удалена из БД.',
          failed: 'Ошибка при удалении категории из БД.',
        },
      },
      info: {
        not_found: 'Данные о POI в БД не найдены.',
      },
      update: {
        success: 'POI обновлён.',
        failed: 'Ошибка при обновлении POI.',
        empty_data: 'Пустые данные POI. Обновление пропущено.',
        exception: 'Непредвиденная ошибка при обновлении POI.',
        exception_unknown: 'Неизвестная ошибка при обновлении POI.',
      },
      list: {
        category_empty: 'Категория пуста.',
      },
      delete: {
        success: 'POI удалён с карты.',
        failed: 'Ошибка при удалении POI из БД.',
        id_empty: 'POI ID пустой. Пропуск.',
      },
      add: {
        success: 'POI добавлен в БД.',
        failed: 'Ошибка при добавлении POI в БД.',
        empty_data: 'На сервер отправлены пустые данные.',
        exception: 'Непредвиденная ошибка при добавлении POI.',
        exception_unknown: 'Неизвестная ошибка при добавлении POI.',
      },
      mark_add: {
        name_invalid: 'Невозможно прочитать значение Name. Добавление метки пропущено.',
        category_id_invalid:
          'Невозможно прочитать значение Category ID. Добавление метки пропущено.',
        coords_invalid: 'Невозможно прочитать значения LNG или LAT. Добавление метки пропущено.',
        success: 'Метка добавлена в БД.',
        failed: 'Ошибка при добавлении метки в БД.',
      },
    },
  },
  toast: {
    storage: {
      updated: 'Путь хранения обновлён.',
      save_failed: 'Не удалось сохранить путь хранения карты.',
    },
  },
  menu: {
    maps: 'Карты',
    layers: 'Слои',
    view: {
      root: 'Вид',
      dark_mode: 'Тёмный режим',
      tile_grid: 'Сетка тайлов',
      clear_tile_grid: 'Убрать сетку тайлов',
      poi_manager: 'POI менеджер',
      gps_info: 'GPS инфо',
      job_manager: 'Менеджер задач',
      poi_manager_actions: {
        create: 'Создать папку',
        rename: 'Переименовать папку',
        move: 'Переместить папку',
        delete: 'Удалить папку',
        delete_title: 'Удалить?',
        delete_confirm:
          'Удалить папку "{name}"? Вложенные папки и POI будут перемещены к родителю.',
        delete_poi_confirm: 'Удалить POI "{name}"?',
        root: 'Корень',
      },
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
        download: 'Скачать...',
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
    job: {
      size: 'Размер',
      tiles: 'Тайлы',
      ese: 'П/П/О',
      time: 'Время',
      eta: 'ETA',
      empty: 'Нет активных задач.',
      actions: {
        up: 'Вверх',
        delete: 'Удалить',
        down: 'Вниз',
      },
    },
    gps: {
      type: {
        label: 'Тип GPS',
        tcp: 'TCP',
        usb: 'USB',
      },
      sample_time: 'Введите время выборки GPS, сек:',
      info: {
        distance_run: 'Пройдено',
        distance_to_go: 'Остаток пути',
        time_to_go: 'Оставшееся время',
        speed: 'Скорость',
        course: 'Курс',
        distance_units: {
          meter: 'м',
          kilometer: 'км',
          mile: 'ми',
          nmile: 'м.ми',
          yard: 'ярд',
          foot: 'фт',
        },
        speed_units: {
          meter: 'м/ч',
          kilometer: 'км/ч',
          mile: 'ми/ч',
          nmile: 'м.ми/ч',
          yard: 'ярд/ч',
          foot: 'фт/ч',
        },
      },
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
        descr: 'Выберите файл маршрута',
        label: 'Файл маршрута',
        hint: 'CSV/TXT в формате GPS маршрута',
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
    job: {
      main: {
        title: 'Загрузка тайлов',
        tabs: {
          download: 'Задача',
          network: 'Сеть',
        },
        map: 'Карта',
        zoom: 'Zoom',
        random_download: 'Случайный режим загрузки',
        overwrite_old_tiles: 'Перезаписать старые тайлы',
        overwrite_different_tiles: 'Перезаписывать только отличающиеся тайлы',
        overwrite_before_date: 'Перезаписывать тайлы до даты',
        save_empty_tiles: 'Сохранять пустые тайлы',
        overwrite_empty_tiles: 'Перезаписывать пустые тайлы',
        custom_network: 'Пользовательские настройки сети',
        delay: 'Задержка (мс)',
        timeout: 'Таймаут (мс)',
        agent: 'User-Agent',
        ban_time_mode: 'Режим бана по времени',
        proxy_custom: 'Использовать прокси',
        proxy_protocol: 'Протокол прокси',
        proxy_host: 'Хост прокси',
        proxy_port: 'Порт прокси',
        proxy_auth: 'Требуется авторизация прокси',
        proxy_user: 'Логин прокси',
        proxy_password: 'Пароль прокси',
      },
    },
    filesystem_tree: {
      title: 'Папка хранения: {name}',
      create: {
        title: 'Создать папку',
        message: 'Имя папки',
      },
      rename: {
        title: 'Переименовать папку',
        message: 'Новое имя папки',
      },
      errors: {
        read_folder: 'Не удалось прочитать папку.',
        create_folder: 'Не удалось создать папку.',
        rename_folder: 'Не удалось переименовать папку.',
        read_server_folder: 'Не удалось прочитать папку сервера.',
        select_folder_to_rename: 'Выберите папку для переименования.',
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
