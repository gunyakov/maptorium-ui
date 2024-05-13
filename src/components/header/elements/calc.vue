<template>
  <div class="header-btn-box">
    <div class="dropdown">
      <button
        class="header-btn"
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        aria-expanded="false"
      >
        <i class="fa-light fa-calculator"></i>
      </button>
      <ul class="dropdown-menu calculator-dropdown">
        <div class="dgb-calc-box">
          <div>
            <input type="text" id="dgbCalcResult" placeholder="0" autocomplete="off" readonly />
          </div>
          <table>
            <tbody>
              <tr>
                <td class="bg-danger">C</td>
                <td class="bg-secondary">CE</td>
                <td class="dgb-calc-oprator bg-primary">/</td>
                <td class="dgb-calc-oprator bg-primary">*</td>
              </tr>
              <tr>
                <td>7</td>
                <td>8</td>
                <td>9</td>
                <td class="dgb-calc-oprator bg-primary">-</td>
              </tr>
              <tr>
                <td>4</td>
                <td>5</td>
                <td>6</td>
                <td class="dgb-calc-oprator bg-primary">+</td>
              </tr>
              <tr>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td rowspan="2" class="dgb-calc-sum bg-primary">=</td>
              </tr>
              <tr>
                <td colspan="2">0</td>
                <td>.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ul>
    </div>
  </div>
</template>
