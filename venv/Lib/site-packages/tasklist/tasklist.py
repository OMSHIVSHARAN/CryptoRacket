import time
import os

from .task import Task
from .utils import get_logger, set_logger

log = get_logger(__name__)


class TaskList:
  """A sorted list of tasks pending execution.
  
  Running the TaskList will execute each task in order (see run_all()).
  A task which completes with success is cleared from the list.
  
  Execution is stopped when a task terminates with a failure.

  The TaskList can be persisted into the filesystem to ensure
  that stored tasks are retained at later executions.  (see serialize()
  and load()).
  """
  def __init__(self, wrkdir=None, autosync=False):
    """Create a TaskList.

    Parameters:
    wrkdir: [path] serialize the TaskList into this filesystem folder.
    autosync: [bool] automatically serialize the TaskList into wrkdir whenever changed."""
    self.wrkdir = wrkdir or '.'
    self.tasks = []
    self.autosync = autosync
    self.latest = None
    if self.autosync:
      self.make_wrkdir()
      self.load()
  
  def add(self, task):
    """Add a Task().
    
    See also: remove()."""
    log.debug("Adding task %s", repr(task))
    self.tasks.append(task)
    self.sort_tasks()
    log.info("Added task %s, now %d tasks.", task, len(self))
    log.debug("Tasklist now: %s", self)
    if self.autosync:
      self.serialize()
    
  def sort_tasks(self):
    """Sort the list of tasks by the desired criterion.
    
    The default criterion is (decreasing) age by default. You may override this method."""
    self.tasks = sorted(self.tasks, key=lambda x: x.ts)

  def __str__(self):
    return '%s@%s' % (self.wrkdir, str(self.tasks))

  def __len__(self):
    return len(self.tasks)

  def __bool__(self):
    return bool(self.tasks)

  def __iter__(self):
    return self.tasks.__iter__()

  def __next__(self):
    return self.tasks.__next__()

  def __eq__(self, b):
    return type(b) == type(self) and [t.ts for t in self] == [t.ts for t in b] and self.wrkdir == b.wrkdir

  def clear(self):
    """Remove all tasks from the TaskList."""
    log.debug("Clearing %d tasks from queue.", len(self.tasks)) # too verbose for info level, downgraded to debug level
    self.tasks = []
    if self.autosync:
      self.serialize()

  def clear_outdated(self, min_age):
    """Remove all tasks older than a given age.

    Raises ValueError if min_age is not a number or not positive.

    Parameters:
    min_age: [float] Remove tasks with age() greater or equal than this."""
    try:
      min_age = float(min_age)
    except:
      raise ValueError("min_age must be a number >= 0")
    if min_age < 0:
      raise ValueError("min_age must be a number >= 0")
    self.tasks = [t for t in self.tasks if t.age() < min_age]

  def run_all(self, skip_permanent_failures=False):
    """Execute all tasks in order until completion or first failure.
    
    Tasks completed successfully are cleared from the list. Failed tasks are
    handled as follows. Any failure interrupts further execution, unless
    skip_permanent_failures is set.

    If skip_permanent_failures is set, permanent failures are discarded without
    interrupting further execution.

    See also: run_one().

    Returns:
    [bool]  True if all tasks in the queue were consumed."""
    while self.tasks:
      t = self.run_one()
      if t.succeeded():
        log.debug("Task %s succeded. %d more pending.", t, len(self.tasks)) # too verbose for info level, downgraded to debug level
      else:
        log.error("Task %s failed with %s error.", t.name, 'retriable' if t.failed_retry() else 'permanent')
        if skip_permanent_failures and not t.failed_retry():
          log.debug("Discarding perm-failed task and continuing with next (skip_permanent_failures=True)") # too verbose for info level, downgraded to debug level
          self.popleft()
          continue
        return False
    return True        
  
  def popleft(self, n=None):
    """Return and remove the first task in the list.
    
    See also: peek().

    Returns:
    [Task]  First task in the list.
    """
    if n is None:
      n = 0
    t = self.tasks.pop(n)
    if self.autosync:
      self.serialize()
    return t
  
  def peek(self, n=None):
    """Return the first task in the list.
    
    See also: popleft().

    Returns:
    [Task]  First task in the list.
    """
    if n is None:
      n = 0
    return self.tasks[n]

  def run_one(self):
    """Run the next task.

    See also: run_next(), run_all().

    Returns:
    [Task] The task executed.
    """
    t = self.popleft(0)
    log.info("Running task %s", t)
    t.run()
    if not t.succeeded():
      self.add(t)
    elif self.autosync:
      self.serialize()
    self.latest = t
    return t

  def run_next(self):
    """Run the next task.
    
    See also: run_one(), run_all().
    
    Returns:
    [bool] True iff the task executed successfully.
    """
    return self.run_one().succeeded()

  def succeeded(self):
    """Return whether the latest task succeeded.

    See also: run_all().

    Returns:
    [bool] True iff the latest task executed successfully or no tasks are pending.
    """
    if self.latest is None:
      if not self.tasks:
        return True
      raise RuntimeError("No task executed yet.")
    return self.latest.succeeded()
  
  def failed_retry(self):
    """Return whether the latest task failed in a retriable way.

    See also: run_all().

    Returns:
    [bool] True iff the latest task executed unsuccessfully, in a temporary way.
    """
    if self.latest is None:
      if not self.tasks:
        return False
      raise RuntimeError("No task executed yet.")
    return self.latest.failed_retry()
  
  def age(self):
    """Return the age (seconds) of the first task.

    Returns:
    [float] The age in seconds of the first task in the list.
    """
    if not self.tasks:
      return 0
    return time.time() - self.peek().ts

  def get_task_files(self):
    """Return tasks currently persisted.
    
    Returns:
    [list] List of filenames for files representing tasks."""
    return sorted([os.path.join(self.wrkdir, fn) for fn in os.listdir(self.wrkdir) if fn.startswith('task@')], key=lambda x: float(x.split('@')[1]))

  def make_wrkdir(self):
    """Create wrkdir."""
    if os.path.exists(self.wrkdir):
      return
    try:
      os.makedirs(self.wrkdir)
    except OSError as e:
      log.error("Unable to create queue wrkdir %s: %s", self.wrkdir, e)

  def serialize(self):
    """Serialize TaskList into wrkdir."""
    log.debug("Serializing %s tasks into '%s'", len(self), self.wrkdir) # too verbose for info level, downgraded to debug level
    self.make_wrkdir()
    # clear previous tasks
    exfiles = self.get_task_files()
    if exfiles:
      log.debug("Clearing %s previously existing task files.", len(exfiles)) # too verbose for info level, downgraded to debug level
      for f in exfiles:
        os.remove(f)
    # serialize current tasks
    for t in self.tasks:
      fname = os.path.join(self.wrkdir, "task@%s@%s" % (str(t.task_id), t.name))
      if os.path.exists(fname):
        log.debug("Skipping serialization of task '%s': %s already serialized", str(t), fname)
      else:
        log.debug("Serializing task '%s' -> %s", str(t), fname)
        with open(fname, 'w+') as f:
          f.write(t.serialize())
  
  def load(self):
    """Load TaskList from working directory."""
    if not os.path.exists(self.wrkdir):
      log.error("Tasklist workdir '%s' does not exist. Skipping.", self.wrkdir)
      return
    for fname in self.get_task_files():
      task = Task.from_bytes(open(fname).read())
      self.tasks.append(task)
    self.sort_tasks()

