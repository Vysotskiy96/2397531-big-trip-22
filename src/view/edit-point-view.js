import { formatDate } from '../utils.js';
import { TYPES_EVENT } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

function createEditPointView(point, offersList, destinations) {
  const {basePrice, dateFrom, dateTo, destination, offers, type} = point;
  const offersPoint = offersList.find((offer) => offer.type === type);

  const destinationPoint = destinations.find((dest) => dest.id === destination);
  const renderDestinationsList = destinations.map((dest) => `<option value=${dest.name}></option>`).join('');

  return (`<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>

            ${TYPES_EVENT.map((typeEvent) => (
      `<div class="event__type-item">
          <input id="event-type-${typeEvent}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi" ${(typeEvent === type ? 'checked' : '')}>
          <label class="event__type-label  event__type-label--${typeEvent}" for="event-type-taxi-1">${typeEvent}</label>
      </div>`
    )).join('')}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationPoint.name}" list="destination-list-1">
        <datalist id="destination-list-1">
          ${renderDestinationsList}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatDate(dateFrom)}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatDate(dateTo)}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
            ${offersPoint.offers.map((offerPoint) => (
      `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${offerPoint.id}" type="checkbox" name="event-offer-luggage" ${(offers.includes(offerPoint.id) ? 'checked' : '')}>
      <label class="event__offer-label" for="event-offer-luggage-${offerPoint.id}">
      <span class="event__offer-title">${offerPoint.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offerPoint.price}</span>
      </label>
      </div>`
    )).join('')}
        </div>
      </section>

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destinationPoint.description}</p>
        <div class="event__photos-container">
              <div class="event__photos-tape">
              ${destinationPoint.pictures.map((image) => `<img class="event__photo" src="${image.src}" alt="${image.description}">`).join('')}
              </div>
        </div>
      </section>
    </section>
  </form>
</li>`);
}

export default class EditPointView extends AbstractView {
  #point = null;
  #offers = null;
  #destinations = null;
  #hundleFormSubmit = null;
  #hundleFormReset = null;

  constructor({point, offers, destinations, onFormSubmit, onFormReset}) {
    super();
    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#hundleFormSubmit = onFormSubmit;
    this.#hundleFormReset = onFormReset;

    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHundler);
    this.element.querySelector('form').addEventListener('reset', this.#formResetHundler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formResetHundler);
  }

  get template() {
    return createEditPointView(this.#point, this.#offers, this.#destinations);
  }

  #formSubmitHundler = (evt) => {
    evt.preventDefault();
    this.#hundleFormSubmit();
  };

  #formResetHundler = () => {
    this.#hundleFormReset();
  };
}
