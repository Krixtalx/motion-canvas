import {
  Subscribable,
  EventDispatcherBase,
  EventHandler,
} from './EventDispatcherBase';

/**
 * Dispatches a {@link SubscribableValueEvent}
 *
 * Changing the value stored by a value dispatcher will immediately notify all
 * its subscribers.
 *
 * Example:
 * ```ts
 * class Example {
 *   // expose the event to external classes
 *   public get onValueChanged {
 *     return this.value.subscribable;
 *   }
 *   // create a private dispatcher
 *   private value = new ValueDispatcher(0);
 *
 *   private changingValueExample() {
 *     // changing the value will notify all subscribers.
 *     this.value.current = 7;
 *   }
 * }
 * ```
 *
 * @template T Type of the value passed to subscribers.
 */
export class ValueDispatcher<T> extends EventDispatcherBase<T> {
  public readonly subscribable: SubscribableValueEvent<T> =
    new SubscribableValueEvent(this);

  /**
   * Set the current value of this dispatcher.
   *
   * Setting the value will immediately notify all subscribers.
   *
   * @param value
   */
  public set current(value: T) {
    this.value = value;
    this.notifySubscribers(value);
  }

  /**
   * @inheritDoc SubscribableValueEvent.current
   */
  public get current() {
    return this.value;
  }

  /**
   * @param value Initial value.
   */
  public constructor(private value: T) {
    super();
  }

  /**
   * @inheritDoc SubscribableValueEvent.subscribe
   */
  public subscribe(handler: EventHandler<T>, dispatchImmediately = true) {
    const unsubscribe = super.subscribe(handler);
    if (dispatchImmediately) {
      handler(this.value);
    }
    return unsubscribe;
  }
}

/**
 * Provides safe access to the public interface of {@link ValueDispatcher}.
 *
 * External classes can use it to subscribe to an event without being able to
 * dispatch it.
 *
 * @template T Type of the value passed to subscribers.
 */
export class SubscribableValueEvent<T> extends Subscribable<
  T,
  EventHandler<T>
> {
  /**
   * Get the most recent value of this dispatcher.
   */
  public get current() {
    return (<ValueDispatcher<T>>this.dispatcher).current;
  }

  /**
   * Subscribe to the event.
   *
   * Subscribing will immediately invoke the handler with the most recent value.
   *
   * @param handler
   * @param dispatchImmediately Whether the handler should be immediately
   *                            invoked with the most recent value.
   *
   * @return Callback function that cancels the subscription.
   */
  public subscribe(
    handler: EventHandler<T>,
    dispatchImmediately = true,
  ): () => void {
    return (<ValueDispatcher<T>>this.dispatcher).subscribe(
      handler,
      dispatchImmediately,
    );
  }
}