// Waiting on https://github.com/Microsoft/TypeScript/issues/10178
/// <reference types="d3"/>
/// <reference types='ts-polyfill/lib/es2015-core'>
/// <reference types='ts-polyfill/lib/es2015-collection'>

// Grid Search
// https://en.wikipedia.org/wiki/A*_search_algorithm

// Max heap based PQ
// https://stackoverflow.com/a/42919752

const _top = 0;
const _parent = i => ((i + 1) >>> 1) - 1;
const _left = i => (i << 1) + 1;
const _right = i => (i + 1) << 1;
class PriorityQueueSet<T> {
  _set: Set<T>;
  _heap: T[];
  _comparator: (a : T, b : T) => boolean;
  constructor(comparator = (a, b) => a > b) {
    this._set = new Set();
    this._heap = [];
    this._comparator = comparator;
  }
  size() {
    return this._heap.length;
  }
  isEmpty() {
    return this.size() == 0;
  }
  push(...values : T[]) {
    values.forEach(value => {
      if(!this._set.has(value)){
        this._heap.push(value);
        this._siftUp();
        this._set.add(value);
      }
    });
    return this.size();
  }
  pop() {
    const poppedValue = this._heap[_top];
    const bottom = this.size() - 1;
    if (bottom > _top) {
      this._swap(_top, bottom);
    }
    this._heap.pop();
    this._siftDown();
    if(this._set.has(poppedValue)){
      this._set.delete(poppedValue);
      return poppedValue;
    }else{
      return this.pop();
    }
  }
  has(value : T) {
    return this._set.has(value);
  }
  delete(value : T) {
    this._set.delete(value);
  }
  _greater(i, j) {
    return this._comparator(this._heap[i], this._heap[j]);
  }
  _swap(i, j) {
    [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
  }
  _siftUp() {
    let node = this.size() - 1;
    while (node > _top && this._greater(node, _parent(node))) {
      this._swap(node, _parent(node));
      node = _parent(node);
    }
  }
  _siftDown() {
    let node = _top;
    while (
      (_left(node) < this.size() && this._greater(_left(node), node)) ||
      (_right(node) < this.size() && this._greater(_right(node), node))
    ) {
      let maxChild = (_right(node) < this.size() && this._greater(_right(node), _left(node))) ? _right(node) : _left(node);
      this._swap(node, maxChild);
      node = maxChild;
    }
  }
}

const GridSearch = (selector : string) : { onclicktouch : (x: number, y: number) => void } => {
  let width, height, canvas = d3.select(selector);
  let context = (<HTMLCanvasElement> canvas.node()).getContext("2d");
  width = $(selector).outerWidth();
  height = $(selector).outerHeight();

  // set how the new images are drawn onto the existing image.
  context.globalCompositeOperation = "source-over";
  //context.translate(width / 2, height / 2);
  //context.scale(12, 8);
  //context.lineWidth = 0.2;

  const gridWidth = 40, gridHeight = 40;
  let grid : Array<Array<boolean>>;
  
  function randomize_grid(){
    grid = Array(gridHeight).fill(0).map((a, i) =>
      Array(gridWidth).fill(0).map((b, j) => {
        i *= 1.0; j *= 1.0;
        return -0.4 * Math.random() > (i + j)/(gridHeight + gridWidth) * ((i + j)/(gridHeight + gridWidth) - 1);
      })
    );
    grid[0][0] = grid[0][1] = grid[1][0] = grid[1][1] = false;
    grid[gridWidth-1][gridHeight-1] = grid[gridWidth-1][gridHeight-2] =
        grid[gridWidth-2][gridHeight-1] = grid[gridWidth-2][gridHeight-2] = false;
  }

  function valid(point){
    return y(point) >= 0 && y(point) < gridHeight
        && x(point) >= 0 && x(point) < gridWidth
        && !grid[y(point)][x(point)];
  }
  function dist_between(point1, point2){
    return Math.sqrt(
      (y(point1) - y(point2)) * (y(point1) - y(point2)) +
      (x(point1) - x(point2)) * (x(point1) - x(point2))
    );
    //return Math.abs(y(point1) - y(point2)) + Math.abs(x(point1) - x(point2));
  }
  function heuristic_cost_est(point1, point2){
    return dist_between(point1, point2);
  }

  // To make it possible to put points into sets, we need primitives.
  const FUDGE = 100000;
  function point(y, x){
    return y * FUDGE + x;
  }
  function x(point){
    return point % FUDGE;
  }
  function y(point){
    return Math.floor(point / FUDGE);
  }

  function get(map : Map<number, number>, key : number) : number{
    if(map.has(key))
      return map.get(key);
    else
      return Infinity;
  }

  const start = point(0, 0), goal = point(gridHeight - 1, gridWidth - 1);
  let gScore, fScore, closedSet, openSet, cameFrom;

  function init_search(){
    gScore = new Map<number, number>();
    fScore = new Map<number, number>();
    closedSet = new Set<number>();
    openSet = new PriorityQueueSet<number>((a, b) => get(fScore, a) < get(fScore, b));
    openSet.push(start);
    cameFrom = new Map<number, number>();
    gScore.set(start, 0);
    fScore.set(start, get(gScore, start) + heuristic_cost_est(start, goal));
  }

  let colorgrid : Array<Array<string>>;

  function init_draw(){
    colorgrid = Array(gridHeight).fill(0).map(a => Array(gridWidth).fill("#555"));
    colorgrid[y(start)][x(start)] = "#f00";
    colorgrid[y(goal)][x(goal)] = "#0f0";
    context.clearRect(0, 0, width, height); // Clear the canvas.
    for(var i = 0; i < gridHeight; i++){
      for(var j = 0; j < gridWidth; j++){
        context.fillStyle = colorgrid[i][j];
        context.fillRect(i * width / gridWidth, j * height / gridHeight, width / gridWidth, height / gridHeight);  
      }
    }
  }

  function show_grid(){
    for(var i = 0; i < gridHeight; i++){
      for(var j = 0; j < gridWidth; j++){
        if(i == 0 && j == 0 || i == gridHeight - 1 && j == gridWidth - 1)
          continue;
        let original = colorgrid[i][j];
        if(grid[i][j]){
          colorgrid[i][j] = "black";
        }
        else if(closedSet.has(point(i, j))){
          colorgrid[i][j] = "#339";
        }
        else if(openSet.has(point(i, j))){
          colorgrid[i][j] = "#933";
        }
        else{
          colorgrid[i][j] ="#555";
        }
        if(colorgrid[i][j] != original){
          context.fillStyle = colorgrid[i][j];
          context.fillRect(i * width / gridWidth, j * height / gridHeight, width / gridWidth, height / gridHeight);
        }
      }
    }
    let curr = goal;
    do{
      colorgrid[y(curr)][x(curr)] = "#0f0";
      context.fillStyle = "#0f0";
      context.fillRect(y(curr) * width / gridWidth, x(curr) * height / gridHeight, width / gridWidth, height / gridHeight);
      curr = cameFrom.get(curr);
    }while(curr != start && curr !== undefined);
  }

  function search_iteration(){
    let current = openSet.pop();
    if(current == goal) return true;
    openSet.delete(current);
    closedSet.add(current);
    for(var di of [-1, 0, 1]){
      for(var dj of [-1, 0, 1]){
        //if(di + dj == 0 || di == dj) continue; // A* doesn't work with manhattan metric apparently?
        let neighbor = point(y(current) + di, x(current) + dj);
        if(!valid(neighbor)) continue;
        if(closedSet.has(neighbor)) continue;// Ignore the neighbor which is already evaluated.
        let tentative_gScore = get(gScore, current) + dist_between(current, neighbor); // The distance from start to a neighbor
        if(!openSet.has(neighbor))	// Discover a new node
          openSet.push(neighbor);
        if(tentative_gScore < get(gScore, neighbor)){
          // This is a first known or better path, record it.
          cameFrom.set(neighbor, current);
          gScore.set(neighbor, tentative_gScore);
          fScore.set(neighbor, get(gScore, neighbor) + heuristic_cost_est(neighbor, goal));
        }
      }
    }
  }

  function reset(){
    randomize_grid();
    init_search();
    init_draw();
    window.requestAnimationFrame(iterate_and_show);
  }
  function iterate_and_show(){
    if(search_iteration() || openSet.size() == 0){
      show_grid();
      setTimeout(reset, 3000);
      return;
    }
    show_grid();
    window.requestAnimationFrame(iterate_and_show);
  }
  reset();

  return {
    onclicktouch: function(x, y){
      // TODO
    }
  };
};


