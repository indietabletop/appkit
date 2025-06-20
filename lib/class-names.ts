type Falsy = false | null | undefined;

type PropsWithClassName = {
  className?: ClassName;
};

type ClassName = string | PropsWithClassName | Falsy;

/**
 * Combines a list of strings or objects with className property into a single
 * string. Falsy values are ignored.
 */
export function classNames(...classNames: ClassName[]) {
  return classNames
    .filter((cn) => !!cn)
    .map((cn) => (typeof cn === "object" ? cn?.className : cn))
    .join(" ");
}

/**
 * Given a list of strings or objects with the className property, returns an
 * object with className property and combined className. Falsy values will
 * be filtered out.
 *
 * @example
 * <h1 {...clx(props, 'heading', 'bold')}>Hello world!</h1>
 */

export function cx(...cns: ClassName[]) {
  return {
    className: classNames(...cns),
  };
}
