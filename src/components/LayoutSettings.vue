<template>
  <!-- right sidebar start -->
  <div class="right-sidebar">
    <button class="right-bar-close"><i class="fa-light fa-angle-right"></i></button>
    <div class="sidebar-title">
      <h3>Layout Settings</h3>
    </div>
    <div class="sidebar-body scrollable">
      <div class="right-sidebar-group">
        <span class="sidebar-subtitle"
          >Nav Position <span><i class="fa-light fa-angle-up"></i></span
        ></span>
        <div class="settings-row">
          <div class="settings-col">
            <div class="dashboard-icon d-flex gap-1 border rounded active" id="verticalMenu">
              <div class="pb-2 px-1 pt-1 bg-menu">
                <div class="px-2 py-1 rounded-pill bg-nav mb-2"></div>
                <div class="border border-primary mb-1">
                  <div class="px-2 pt-1 bg-nav mb-1"></div>
                  <div class="px-2 pt-1 bg-nav mb-1"></div>
                </div>
                <div class="border border-primary">
                  <div class="px-2 pt-1 bg-nav mb-1"></div>
                  <div class="px-2 pt-1 bg-nav mb-1"></div>
                </div>
              </div>
              <div class="w-100 d-flex flex-column justify-content-between">
                <div class="px-2 py-1 bg-menu"></div>
                <div class="px-2 py-1 bg-menu"></div>
              </div>
              <span class="part-txt">Vertical</span>
            </div>
          </div>
          <div class="settings-col d-lg-block d-none">
            <div class="dashboard-icon d-flex h-100 gap-1 border rounded" id="horizontalMenu">
              <div class="w-100 d-flex flex-column justify-content-between">
                <div>
                  <div class="p-1 bg-menu border-bottom">
                    <div class="rounded-circle p-1 bg-nav w-max-content"></div>
                  </div>
                  <div class="p-1 bg-menu d-flex gap-1 mb-1">
                    <div class="w-max-content px-2 pt-1 rounded bg-nav"></div>
                    <div class="w-max-content px-2 pt-1 rounded bg-nav"></div>
                    <div class="w-max-content px-2 pt-1 rounded bg-nav"></div>
                    <div class="w-max-content px-2 pt-1 rounded bg-nav"></div>
                  </div>
                </div>
                <div class="px-2 py-1 bg-menu"></div>
              </div>
              <span class="part-txt">Horizontal</span>
            </div>
          </div>
          <div class="settings-col">
            <div class="dashboard-icon d-flex gap-1 border rounded" id="twoColumnMenu">
              <div class="p-1 bg-menu"></div>
              <div class="pb-4 px-1 pt-1 bg-menu">
                <div class="px-2 py-1 rounded-pill bg-nav mb-2"></div>
                <div class="px-2 pt-1 bg-nav mb-1"></div>
                <div class="px-2 pt-1 bg-nav mb-1"></div>
                <div class="px-2 pt-1 bg-nav mb-1"></div>
              </div>
              <div class="w-100 d-flex flex-column justify-content-between">
                <div class="px-2 py-1 bg-menu"></div>
                <div class="px-2 py-1 bg-menu"></div>
              </div>
              <span class="part-txt">Two column</span>
            </div>
          </div>
          <div class="settings-col">
            <div class="dashboard-icon d-flex gap-1 border rounded" id="flushMenu">
              <div class="pb-4 px-1 pt-1 bg-menu">
                <div class="px-2 py-1 rounded-pill bg-nav mb-2"></div>
                <div class="px-2 pt-1 bg-nav mb-1"></div>
                <div class="px-2 pt-1 bg-nav mb-1"></div>
                <div class="px-2 pt-1 bg-nav mb-1"></div>
              </div>
              <div class="w-100 d-flex flex-column justify-content-between">
                <div class="px-2 py-1 bg-menu"></div>
                <div class="px-2 py-1 bg-menu"></div>
              </div>
              <span class="part-txt">Flush</span>
            </div>
          </div>
        </div>
      </div>
      <div class="right-sidebar-group">
        <span class="sidebar-subtitle"
          >Theme Direction <span><i class="fa-light fa-angle-up"></i></span
        ></span>
        <div>
          <div class="btn-group d-flex">
            <button class="btn btn-primary active w-50" id="dirLtr">LTR</button>
            <button class="btn btn-primary w-50" id="dirRtl">RTL</button>
          </div>
        </div>
      </div>
      <div class="right-sidebar-group">
        <span class="sidebar-subtitle"
          >Primary Color <span><i class="fa-light fa-angle-up"></i></span
        ></span>
        <div class="settings-row-2">
          <button class="color-palette color-palette-1 active" data-color="blue-color">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </button>
          <button class="color-palette color-palette-2" data-color="orange-color">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </button>
          <button class="color-palette color-palette-3" data-color="pink-color">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </button>
          <button class="color-palette color-palette-4" data-color="eagle_green-color">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </button>
          <button class="color-palette color-palette-5" data-color="purple-color">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </button>
          <button class="color-palette color-palette-6" data-color="gold-color">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </button>
          <button class="color-palette color-palette-7" data-color="green-color">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </button>
          <button class="color-palette color-palette-8" data-color="deep_pink-color">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </button>
          <button class="color-palette color-palette-9" data-color="tea_green-color">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </button>
          <button class="color-palette color-palette-10" data-color="yellow_green-color">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
      <div class="right-sidebar-group">
        <span class="sidebar-subtitle"
          >Theme Color <span><i class="fa-light fa-angle-up"></i></span
        ></span>
        <div class="settings-row">
          <div class="settings-col">
            <div class="dashboard-icon d-flex bg-blue-theme gap-1 border rounded" id="blueTheme">
              <div class="pb-4 px-1 pt-1 bg-menu">
                <div class="px-2 py-1 rounded-pill bg-nav mb-2"></div>
                <div class="px-2 pt-1 bg-nav mb-1"></div>
                <div class="px-2 pt-1 bg-nav mb-1"></div>
                <div class="px-2 pt-1 bg-nav mb-1"></div>
              </div>
              <div class="w-100 d-flex flex-column justify-content-between">
                <div class="px-2 py-1 bg-menu"></div>
                <div class="px-2 py-1 bg-menu"></div>
              </div>
              <span class="part-txt">Blue Theme</span>
            </div>
          </div>
          <div class="settings-col">
            <div
              class="dashboard-icon d-flex gap-1 border rounded bg-body-secondary light-theme-btn active"
              id="lightTheme"
            >
              <div class="pb-4 px-1 pt-1 bg-dark-subtle">
                <div class="px-2 py-1 rounded-pill bg-primary mb-2"></div>
                <div class="px-2 pt-1 bg-primary mb-1"></div>
                <div class="px-2 pt-1 bg-primary mb-1"></div>
                <div class="px-2 pt-1 bg-primary mb-1"></div>
              </div>
              <div class="w-100 d-flex flex-column justify-content-between">
                <div class="px-2 py-1 bg-dark-subtle"></div>
                <div class="px-2 py-1 bg-dark-subtle"></div>
              </div>
              <span class="part-txt">Light Theme</span>
            </div>
          </div>
          <div class="settings-col">
            <div class="dashboard-icon d-flex gap-1 border rounded bg-dark" id="darkTheme">
              <div class="pb-4 px-1 pt-1 bg-menu">
                <div class="px-2 py-1 rounded-pill bg-nav mb-2"></div>
                <div class="px-2 pt-1 bg-nav mb-1"></div>
                <div class="px-2 pt-1 bg-nav mb-1"></div>
                <div class="px-2 pt-1 bg-nav mb-1"></div>
              </div>
              <div class="w-100 d-flex flex-column justify-content-between">
                <div class="px-2 py-1 bg-menu"></div>
                <div class="px-2 py-1 bg-menu"></div>
              </div>
              <span class="part-txt">Dark Theme</span>
            </div>
          </div>
        </div>
      </div>
      <div class="right-sidebar-group" id="navBarSizeGroup">
        <span class="sidebar-subtitle"
          >Navbar Size <span><i class="fa-light fa-angle-up"></i></span
        ></span>
        <div class="settings-row">
          <div class="settings-col">
            <div class="dashboard-icon d-flex gap-1 border rounded active" id="sidebarDefault">
              <div class="pb-4 px-1 pt-1 bg-menu">
                <div class="px-2 py-1 rounded-pill bg-nav mb-2"></div>
                <div class="px-2 pt-1 bg-nav mb-1"></div>
                <div class="px-2 pt-1 bg-nav mb-1"></div>
                <div class="px-2 pt-1 bg-nav mb-1"></div>
              </div>
              <div class="w-100 d-flex flex-column justify-content-between">
                <div class="px-2 py-1 bg-menu"></div>
                <div class="px-2 py-1 bg-menu"></div>
              </div>
              <span class="part-txt">Default</span>
            </div>
          </div>
          <div class="settings-col">
            <div class="dashboard-icon d-flex gap-1 border rounded" id="sidebarSmall">
              <div class="pb-4 pt-1 bg-menu">
                <div class="p-1 rounded-pill bg-nav mb-2"></div>
                <div class="ps-1 pt-1 bg-nav mb-1"></div>
                <div class="ps-1 pt-1 bg-nav mb-1"></div>
                <div class="ps-1 pt-1 bg-nav mb-1"></div>
              </div>
              <div class="w-100 d-flex flex-column justify-content-between">
                <div class="px-2 py-1 bg-menu"></div>
                <div class="px-2 py-1 bg-menu"></div>
              </div>
              <span class="part-txt">Small icon</span>
            </div>
          </div>
          <div class="settings-col">
            <div class="dashboard-icon d-flex gap-1 border rounded" id="sidebarHover">
              <div class="pb-4 pt-1 bg-menu">
                <div class="p-1 rounded-pill bg-nav mb-2"></div>
                <div class="ps-1 pt-1 bg-nav mb-1"></div>
                <div class="ps-1 pt-1 bg-nav mb-1"></div>
                <div class="ps-1 pt-1 bg-nav mb-1"></div>
              </div>
              <div class="w-100 d-flex flex-column justify-content-between">
                <div class="px-2 py-1 bg-menu"></div>
                <div class="px-2 py-1 bg-menu"></div>
              </div>
              <span class="part-txt">Expand on hover</span>
            </div>
          </div>
        </div>
      </div>
      <div class="right-sidebar-group">
        <span class="sidebar-subtitle"
          >Sidebar Background <span><i class="fa-light fa-angle-up"></i></span
        ></span>
        <div>
          <div class="sidebar-bg-btn-box">
            <button id="noBackground">
              <span><i class="fa-light fa-xmark"></i></span>
            </button>
            <button class="sidebar-bg-btn" data-img="assets/images/nav-bg-1.jpg"></button>
            <button class="sidebar-bg-btn" data-img="assets/images/nav-bg-2.jpg"></button>
            <button class="sidebar-bg-btn" data-img="assets/images/nav-bg-3.jpg"></button>
            <button class="sidebar-bg-btn" data-img="assets/images/nav-bg-4.jpg"></button>
          </div>
        </div>
      </div>
      <div class="right-sidebar-group">
        <span class="sidebar-subtitle"
          >Main Background <span><i class="fa-light fa-angle-up"></i></span
        ></span>
        <div>
          <div class="main-content-bg-btn-box">
            <button id="noBackground2">
              <span><i class="fa-light fa-xmark"></i></span>
            </button>
            <button class="main-content-bg-btn" data-img="assets/images/main-bg-1.jpg"></button>
            <button class="main-content-bg-btn" data-img="assets/images/main-bg-2.jpg"></button>
            <button class="main-content-bg-btn" data-img="assets/images/main-bg-3.jpg"></button>
            <button class="main-content-bg-btn" data-img="assets/images/main-bg-4.jpg"></button>
          </div>
        </div>
      </div>
      <div class="right-sidebar-group">
        <span class="sidebar-subtitle"
          >Main preloader <span><i class="fa-light fa-angle-up"></i></span
        ></span>
        <div class="settings-row">
          <div class="settings-col">
            <div class="dashboard-icon d-flex gap-1 border rounded" id="enableLoader">
              <div class="pb-4 px-1 pt-1 bg-menu">
                <div class="px-2 py-1 rounded-pill bg-nav mb-2"></div>
                <div class="px-2 pt-1 bg-nav mb-1"></div>
                <div class="px-2 pt-1 bg-nav mb-1"></div>
                <div class="px-2 pt-1 bg-nav mb-1"></div>
              </div>
              <div class="w-100 d-flex flex-column justify-content-between">
                <div class="px-2 py-1 bg-menu"></div>
                <div class="px-2 py-1 bg-menu"></div>
              </div>
              <div class="preloader-small">
                <div class="loader">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <span class="part-txt">Enable</span>
            </div>
          </div>
          <div class="settings-col">
            <div class="dashboard-icon d-flex gap-1 border rounded active" id="disableLoader">
              <div class="pb-4 px-1 pt-1 bg-menu">
                <div class="px-2 py-1 rounded-pill bg-nav mb-2"></div>
                <div class="px-2 pt-1 bg-nav mb-1"></div>
                <div class="px-2 pt-1 bg-nav mb-1"></div>
                <div class="px-2 pt-1 bg-nav mb-1"></div>
              </div>
              <div class="w-100 d-flex flex-column justify-content-between">
                <div class="px-2 py-1 bg-menu"></div>
                <div class="px-2 py-1 bg-menu"></div>
              </div>
              <span class="part-txt">Disable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- right sidebar end -->
</template>
