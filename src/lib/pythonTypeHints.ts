export interface ParameterHint {
  name: string;
  type: string;
  default?: string;
  description: string;
  required: boolean;
}

export interface TypeHintInfo {
  name: string;
  signature: string;
  returnType: string;
  summary: string;
  parameters: ParameterHint[];
  example: string;
  category: "io" | "collection" | "math" | "conversion" | "utility" | "inspection";
}

export const PYTHON_BUILTIN_TYPE_HINTS: Record<string, TypeHintInfo> = {
  print: {
    name: "print",
    signature: "print(*values: object, sep: str = ' ', end: str = '\\n', file: SupportsWrite = sys.stdout, flush: bool = False) -> None",
    returnType: "None",
    summary: "Prints values to a stream, or to sys.stdout by default.",
    parameters: [
      { name: "*values", type: "object", description: "Any number of objects to print, separated by commas.", required: true },
      { name: "sep", type: "str", default: "' '", description: "String inserted between values.", required: false },
      { name: "end", type: "str", default: "'\\n'", description: "String appended after the last value.", required: false },
      { name: "file", type: "SupportsWrite", default: "sys.stdout", description: "A file-like stream object (defaults to console).", required: false },
      { name: "flush", type: "bool", default: "False", description: "Whether to forcibly flush the stream buffer immediately.", required: false },
    ],
    example: "print('Score:', 95, sep=' - ', end='!\\n')",
    category: "io",
  },
  len: {
    name: "len",
    signature: "len(obj: Sized) -> int",
    returnType: "int",
    summary: "Return the number of items in a sequence or collection (string, list, tuple, dict, set).",
    parameters: [
      { name: "obj", type: "Sized", description: "The container sequence whose length to measure.", required: true },
    ],
    example: "total_items = len(['apple', 'banana', 'cherry'])  # returns 3",
    category: "collection",
  },
  range: {
    name: "range",
    signature: "range(stop: int) -> range\nrange(start: int, stop: int, step: int = 1) -> range",
    returnType: "range",
    summary: "Returns an immutable arithmetic sequence of numbers from start (inclusive) to stop (exclusive).",
    parameters: [
      { name: "start", type: "int", default: "0", description: "Starting value of the sequence (inclusive).", required: false },
      { name: "stop", type: "int", description: "Stopping boundary of the sequence (exclusive).", required: true },
      { name: "step", type: "int", default: "1", description: "Increment (or decrement) between sequence items.", required: false },
    ],
    example: "for i in range(1, 10, 2):\n    print(i)  # 1, 3, 5, 7, 9",
    category: "collection",
  },
  input: {
    name: "input",
    signature: "input(prompt: object = '') -> str",
    returnType: "str",
    summary: "Reads a line from standard input, converts it to a string (stripping the trailing newline), and returns it.",
    parameters: [
      { name: "prompt", type: "object", default: "''", description: "Optional message written to standard output without trailing newline before reading.", required: false },
    ],
    example: "name = input('Enter your name: ')\nprint(f'Hello, {name}')",
    category: "io",
  },
  int: {
    name: "int",
    signature: "int(x: str | bytes | SupportsInt = 0, base: int = 10) -> int",
    returnType: "int",
    summary: "Convert a number or string to an integer, or return 0 if no arguments are given.",
    parameters: [
      { name: "x", type: "str | float | int", default: "0", description: "Value to convert to an integer.", required: false },
      { name: "base", type: "int", default: "10", description: "Radix for string conversion (between 2 and 36).", required: false },
    ],
    example: "num = int('42')\nhex_val = int('1a', 16)  # returns 26",
    category: "conversion",
  },
  str: {
    name: "str",
    signature: "str(object: object = '') -> str",
    returnType: "str",
    summary: "Returns a readable string representation of the given object.",
    parameters: [
      { name: "object", type: "object", default: "''", description: "Object to convert to text.", required: false },
    ],
    example: "msg = 'Number: ' + str(100)",
    category: "conversion",
  },
  float: {
    name: "float",
    signature: "float(x: str | bytes | SupportsFloat = 0.0) -> float",
    returnType: "float",
    summary: "Convert a string or numeric value into a floating-point number.",
    parameters: [
      { name: "x", type: "str | int | float", default: "0.0", description: "Number or decimal string to parse.", required: false },
    ],
    example: "pi_approx = float('3.14159')",
    category: "conversion",
  },
  bool: {
    name: "bool",
    signature: "bool(x: object = False) -> bool",
    returnType: "bool",
    summary: "Return a Boolean value (True or False) evaluated using standard Python truth-testing rules.",
    parameters: [
      { name: "x", type: "object", default: "False", description: "Object to test for truthiness.", required: false },
    ],
    example: "has_items = bool([1, 2, 3])  # returns True",
    category: "conversion",
  },
  list: {
    name: "list",
    signature: "list(iterable: Iterable[T] = []) -> list[T]",
    returnType: "list",
    summary: "Constructs a new mutable sequence list containing elements from an iterable.",
    parameters: [
      { name: "iterable", type: "Iterable[T]", default: "[]", description: "Source collection to convert into a list.", required: false },
    ],
    example: "chars = list('python')  # ['p', 'y', 't', 'h', 'o', 'n']",
    category: "collection",
  },
  dict: {
    name: "dict",
    signature: "dict(**kwargs: Any) -> dict[str, Any]\ndict(mapping: Mapping[K, V]) -> dict[K, V]",
    returnType: "dict",
    summary: "Creates a key-value hash map dictionary.",
    parameters: [
      { name: "mapping_or_iterable", type: "Mapping | Iterable", default: "{}", description: "Key-value pairs or another dict.", required: false },
      { name: "**kwargs", type: "Any", description: "Keyword arguments as dictionary keys and values.", required: false },
    ],
    example: "user = dict(name='Alice', age=24, role='admin')",
    category: "collection",
  },
  set: {
    name: "set",
    signature: "set(iterable: Iterable[T] = []) -> set[T]",
    returnType: "set",
    summary: "Builds an unordered collection of distinct, unique elements.",
    parameters: [
      { name: "iterable", type: "Iterable[T]", default: "[]", description: "Collection of items to deduplicate into a set.", required: false },
    ],
    example: "unique_nums = set([1, 2, 2, 3, 3, 4])  # {1, 2, 3, 4}",
    category: "collection",
  },
  tuple: {
    name: "tuple",
    signature: "tuple(iterable: Iterable[T] = ()) -> tuple[T, ...]",
    returnType: "tuple",
    summary: "Constructs an immutable, ordered sequence of elements.",
    parameters: [
      { name: "iterable", type: "Iterable[T]", default: "()", description: "Collection of items to pack into an immutable tuple.", required: false },
    ],
    example: "point = tuple([10, 20])  # (10, 20)",
    category: "collection",
  },
  enumerate: {
    name: "enumerate",
    signature: "enumerate(iterable: Iterable[T], start: int = 0) -> enumerate[tuple[int, T]]",
    returnType: "enumerate",
    summary: "Returns an enumerate iterator yielding (index, item) pairs from an iterable.",
    parameters: [
      { name: "iterable", type: "Iterable[T]", description: "The sequence to iterate over.", required: true },
      { name: "start", type: "int", default: "0", description: "Starting integer index count.", required: false },
    ],
    example: "for idx, fruit in enumerate(['apple', 'banana'], start=1):\n    print(f'{idx}. {fruit}')",
    category: "collection",
  },
  zip: {
    name: "zip",
    signature: "zip(*iterables: Iterable[Any], strict: bool = False) -> zip[tuple[Any, ...]]",
    returnType: "zip",
    summary: "Iterates over multiple collections simultaneously, yielding tuples containing one element from each iterable.",
    parameters: [
      { name: "*iterables", type: "Iterable[Any]", description: "Two or more iterables to pair together.", required: true },
      { name: "strict", type: "bool", default: "False", description: "If True, raises ValueError when one iterable runs out before others.", required: false },
    ],
    example: "names = ['Alice', 'Bob']\nscores = [85, 92]\nfor name, score in zip(names, scores):\n    print(f'{name}: {score}')",
    category: "collection",
  },
  sum: {
    name: "sum",
    signature: "sum(iterable: Iterable[SupportsAdd], start: SupportsAdd = 0) -> SupportsAdd",
    returnType: "int | float",
    summary: "Calculates the total sum of items in an iterable, plus the optional start value.",
    parameters: [
      { name: "iterable", type: "Iterable[int | float]", description: "Numeric sequence to calculate sum of.", required: true },
      { name: "start", type: "int | float", default: "0", description: "Starting accumulator value.", required: false },
    ],
    example: "total = sum([10, 20, 30], 5)  # returns 65",
    category: "math",
  },
  max: {
    name: "max",
    signature: "max(iterable: Iterable[T], key: Callable[[T], Any] = None, default: T = None) -> T",
    returnType: "T",
    summary: "Returns the maximum value from an iterable or between two or more arguments.",
    parameters: [
      { name: "iterable", type: "Iterable[T]", description: "Items to compare.", required: true },
      { name: "key", type: "Callable", default: "None", description: "Single-argument order function.", required: false },
      { name: "default", type: "T", default: "None", description: "Fallback if iterable is empty.", required: false },
    ],
    example: "highest = max([4, 12, 8, 3])  # returns 12",
    category: "math",
  },
  min: {
    name: "min",
    signature: "min(iterable: Iterable[T], key: Callable[[T], Any] = None, default: T = None) -> T",
    returnType: "T",
    summary: "Returns the minimum value from an iterable or between two or more arguments.",
    parameters: [
      { name: "iterable", type: "Iterable[T]", description: "Items to compare.", required: true },
      { name: "key", type: "Callable", default: "None", description: "Single-argument order function.", required: false },
      { name: "default", type: "T", default: "None", description: "Fallback if iterable is empty.", required: false },
    ],
    example: "lowest = min([4, 12, 8, 3])  # returns 3",
    category: "math",
  },
  sorted: {
    name: "sorted",
    signature: "sorted(iterable: Iterable[T], key: Callable[[T], Any] = None, reverse: bool = False) -> list[T]",
    returnType: "list[T]",
    summary: "Returns a new sorted list containing all elements from the iterable in ascending order.",
    parameters: [
      { name: "iterable", type: "Iterable[T]", description: "Sequence of items to sort.", required: true },
      { name: "key", type: "Callable", default: "None", description: "Custom extraction function used to extract comparison key.", required: false },
      { name: "reverse", type: "bool", default: "False", description: "If True, items are sorted in descending order.", required: false },
    ],
    example: "ordered = sorted([5, 2, 9, 1], reverse=True)  # [9, 5, 2, 1]",
    category: "collection",
  },
  reversed: {
    name: "reversed",
    signature: "reversed(seq: Sequence[T]) -> Iterator[T]",
    returnType: "Iterator[T]",
    summary: "Returns a reverse iterator over the elements of a sequence.",
    parameters: [
      { name: "seq", type: "Sequence[T]", description: "Sequence or object implementing __reversed__.", required: true },
    ],
    example: "rev_letters = list(reversed(['a', 'b', 'c']))  # ['c', 'b', 'a']",
    category: "collection",
  },
  map: {
    name: "map",
    signature: "map(func: Callable[..., R], *iterables: Iterable[Any]) -> map[R]",
    returnType: "map",
    summary: "Applies a transformation function to each item of iterable(s) and returns a generator iterator.",
    parameters: [
      { name: "func", type: "Callable", description: "Transformation function to execute on each item.", required: true },
      { name: "*iterables", type: "Iterable", description: "One or more sequences to map over.", required: true },
    ],
    example: "doubled = list(map(lambda x: x * 2, [1, 2, 3]))  # [2, 4, 6]",
    category: "utility",
  },
  filter: {
    name: "filter",
    signature: "filter(func: Callable[[T], bool] | None, iterable: Iterable[T]) -> filter[T]",
    returnType: "filter",
    summary: "Filters an iterable by testing each element with a predicate function, retaining only elements where func returns True.",
    parameters: [
      { name: "func", type: "Callable | None", description: "Predicate condition (or None to test truthiness).", required: true },
      { name: "iterable", type: "Iterable[T]", description: "Items to filter.", required: true },
    ],
    example: "evens = list(filter(lambda x: x % 2 == 0, [1, 2, 3, 4]))  # [2, 4]",
    category: "utility",
  },
  type: {
    name: "type",
    signature: "type(object: object) -> type",
    returnType: "type",
    summary: "Returns the type class object of the passed value.",
    parameters: [
      { name: "object", type: "object", description: "Any object to inspect.", required: true },
    ],
    example: "t = type('hello')  # <class 'str'>",
    category: "inspection",
  },
  isinstance: {
    name: "isinstance",
    signature: "isinstance(object: object, classinfo: type | tuple[type, ...]) -> bool",
    returnType: "bool",
    summary: "Returns True if the object is an instance or subclass of classinfo.",
    parameters: [
      { name: "object", type: "object", description: "Instance to verify.", required: true },
      { name: "classinfo", type: "type | tuple[type, ...]", description: "Class or tuple of classes to check against.", required: true },
    ],
    example: "is_text = isinstance('abc', str)  # returns True",
    category: "inspection",
  },
  abs: {
    name: "abs",
    signature: "abs(x: SupportsAbs) -> int | float",
    returnType: "int | float",
    summary: "Returns the positive absolute magnitude of a number.",
    parameters: [
      { name: "x", type: "int | float", description: "A number whose absolute value to calculate.", required: true },
    ],
    example: "magnitude = abs(-42)  # returns 42",
    category: "math",
  },
  round: {
    name: "round",
    signature: "round(number: float, ndigits: int | None = None) -> int | float",
    returnType: "int | float",
    summary: "Rounds a number to ndigits decimal places, or to the nearest integer if ndigits is omitted.",
    parameters: [
      { name: "number", type: "float", description: "The float number to round.", required: true },
      { name: "ndigits", type: "int | None", default: "None", description: "Number of decimal places to preserve.", required: false },
    ],
    example: "val = round(3.14159, 2)  # returns 3.14",
    category: "math",
  },
  all: {
    name: "all",
    signature: "all(iterable: Iterable[object]) -> bool",
    returnType: "bool",
    summary: "Returns True if all elements of the iterable evaluate to True (or if iterable is empty).",
    parameters: [
      { name: "iterable", type: "Iterable[object]", description: "Sequence of conditions to verify.", required: true },
    ],
    example: "ready = all([x > 0 for x in [2, 4, 6]])  # True",
    category: "utility",
  },
  any: {
    name: "any",
    signature: "any(iterable: Iterable[object]) -> bool",
    returnType: "bool",
    summary: "Returns True if at least one element of the iterable evaluates to True.",
    parameters: [
      { name: "iterable", type: "Iterable[object]", description: "Sequence of conditions to check.", required: true },
    ],
    example: "has_negative = any(x < 0 for x in [1, -2, 3])  # True",
    category: "utility",
  },
  open: {
    name: "open",
    signature: "open(file: str | PathLike, mode: str = 'r', encoding: str | None = None) -> IO[Any]",
    returnType: "IO",
    summary: "Opens a file resource and returns a corresponding file stream.",
    parameters: [
      { name: "file", type: "str | PathLike", description: "Path to file.", required: true },
      { name: "mode", type: "str", default: "'r'", description: "'r' (read), 'w' (write), 'a' (append), 'b' (binary).", required: false },
      { name: "encoding", type: "str | None", default: "None", description: "Text encoding (e.g. 'utf-8').", required: false },
    ],
    example: "with open('notes.txt', 'r', encoding='utf-8') as f:\n    text = f.read()",
    category: "io",
  },
  help: {
    name: "help",
    signature: "help(request: object = None) -> None",
    returnType: "None",
    summary: "Invokes the interactive built-in Python help system or prints docstring documentation for a function/class.",
    parameters: [
      { name: "request", type: "object", default: "None", description: "Object, module, or keyword to get documentation for.", required: false },
    ],
    example: "help(str.split)",
    category: "inspection",
  },
  id: {
    name: "id",
    signature: "id(obj: object) -> int",
    returnType: "int",
    summary: "Returns the identity of an object as an integer guaranteed to be unique and constant for its lifetime.",
    parameters: [
      { name: "obj", type: "object", description: "Any object.", required: true },
    ],
    example: "obj_id = id([1, 2, 3])",
    category: "inspection",
  },
  hasattr: {
    name: "hasattr",
    signature: "hasattr(object: object, name: str) -> bool",
    returnType: "bool",
    summary: "Returns True if the object has an attribute with the specified string name.",
    parameters: [
      { name: "object", type: "object", description: "Target object.", required: true },
      { name: "name", type: "str", description: "Attribute property name to check.", required: true },
    ],
    example: "has_split = hasattr('hello', 'split')  # True",
    category: "inspection",
  },
  getattr: {
    name: "getattr",
    signature: "getattr(object: object, name: str, default: Any = ...) -> Any",
    returnType: "Any",
    summary: "Gets the attribute value of an object dynamically by string name.",
    parameters: [
      { name: "object", type: "object", description: "Target object.", required: true },
      { name: "name", type: "str", description: "Attribute name string.", required: true },
      { name: "default", type: "Any", default: "None", description: "Value returned if attribute does not exist.", required: false },
    ],
    example: "val = getattr(math, 'pi', 3.14)",
    category: "inspection",
  },
  pow: {
    name: "pow",
    signature: "pow(base: int | float, exp: int | float, mod: int = None) -> int | float",
    returnType: "int | float",
    summary: "Returns base to the power exp (base ** exp); if mod is present, returns base ** exp % mod.",
    parameters: [
      { name: "base", type: "int | float", description: "Base number.", required: true },
      { name: "exp", type: "int | float", description: "Exponent power.", required: true },
      { name: "mod", type: "int | None", default: "None", description: "Optional modulus divisor.", required: false },
    ],
    example: "result = pow(2, 8)  # 256",
    category: "math",
  },
  slice: {
    name: "slice",
    signature: "slice(stop: int) -> slice\nslice(start: int, stop: int, step: int = 1) -> slice",
    returnType: "slice",
    summary: "Constructs a slice object used in extended slicing syntax.",
    parameters: [
      { name: "start", type: "int", default: "0", description: "Start index.", required: false },
      { name: "stop", type: "int", description: "Stop index.", required: true },
      { name: "step", type: "int", default: "1", description: "Step increment.", required: false },
    ],
    example: "first_three = slice(0, 3)\nitems = ['a', 'b', 'c', 'd'][first_three]  # ['a', 'b', 'c']",
    category: "collection",
  },
};

/**
 * Returns type hint metadata if the given word is a recognized Python built-in function.
 */
export function getPythonTypeHint(word: string): TypeHintInfo | null {
  if (!word) return null;
  const cleanWord = word.trim();
  return PYTHON_BUILTIN_TYPE_HINTS[cleanWord] || null;
}
