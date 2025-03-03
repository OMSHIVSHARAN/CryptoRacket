import json
import subprocess
import time
import tempfile
import string

from .utils import get_logger, set_logger

log = get_logger(__name__)

class Task:
  def __init__(self, cmd, args=[], stdin=None, cwd=None, env={}, name=None):
    """Create a Task object.

    Parameters:
    cmd: [str or list of str] Command to execute.
    args: [list of str] Arguments to pass to the command.
    stdin: [str] Optional text to pass as stdin when executing cmd.
    cwd: [str] Optional filesystem path to use as Current Working Directory when executin cmd.
    env: [dict of str:str] Optional environment variables to pass during cmd execution.
    name: [str] Optional simple name of task; Defaults to cmd.
    """
    self.ts = time.time()
    self.task_id = '%.6f' % self.ts
    if args is None:
      args = []
    if type(cmd) is list:
      cmd, args = cmd[0], cmd[1:]
      args += args
    self.name = self.mk_name(name or cmd)
    self.cmd = {
      'command': cmd,
      'args': args,
      'stdin': stdin,
      'cwd': cwd,
      'env': env,
    }
    self.status = {
      'startts': None,
      'runtime_s': None,
      'returncode': None,
      'stdout': None,
      'stderr': None,
    }
    log.debug("Built task '%s'", self)
  
  def __eq__(self, b):
    for prop in ['ts', 'name', 'cmd']:
      if getattr(self, prop) != getattr(b, prop):
        return False
    return True

  def __str__(self):
    return "%s@%s" % (self.task_id, self.name)

  def __repr__(self):
    return '|'.join(str(x) for x in [self.task_id, self.name, self.cmd, self.status])

  def mk_name(self, value):
    valid_fs_chars = '_-. ' + string.ascii_letters + string.digits
    newval = ''
    for i, c in enumerate(value):
      newval += c if c in valid_fs_chars else '_'
    return newval

  def get_cmd(self):
    """Return the command to use when running the task.

    Returns:
    [list of str] Comand and arguments to execute."""
    return [self.cmd['command']] + self.cmd['args']

  def get_stdin(self):
    """Return the text to be passed as stdin when running the task.

    Returns:
    [str] Text to pass to the process as stdin."""
    return self.cmd['stdin']
  
  def get_env(self):
    """Return the Environment variables to use when running the task.

    Returns:
    [dict of str:str] name:value dictionary of environment variables."""
    return self.cmd['env']
  
  def get_cwd(self):
    """Return the Current Working Directory to use when running the task.

    Returns:
    [str] Current working directory value."""
    return self.cmd['cwd']

  def age(self):
    """Return the age of the task.

    Returns:
    [float] Seconds elapsed since the creation of the task."""
    return time.time() - self.ts

  def run(self):
    """Execute the task.
    
    Returns:
    [bool] True iff the task terminated with an exit status == 0"""
    if type(self.cmd['command']) is not str:
      raise ValueError('Invalid command provided! Need string, got %s', type(self.cmd['command']))
    cmdline = [self.cmd['command']]
    cmdline.extend(self.cmd['args'])
    # create files for stdout and stderr
    with tempfile.TemporaryFile() as sout:
      with tempfile.TemporaryFile() as serr:
        p = subprocess.Popen(cmdline, cwd=self.cmd['cwd'], env=self.cmd['env'], stdin=self.cmd['stdin'], stdout=sout, stderr=serr)
        self.status['startts'] = time.time()
        log.debug("Starting task '%s': %s", self, cmdline) # too verbose for info level, downgraded to debug level
        p.communicate()
        # done!
        self.status['runtime_s'] = time.time() - self.status['startts']
        self.status['returncode'] = p.returncode
        log.debug("Exited %s in %ss", self.status['returncode'], round(self.status['runtime_s'], 2)) # too verbose for info level, downgraded to debug level
        sout.seek(0)
        serr.seek(0)
        self.status['stdout'] = sout.read().strip()
        self.status['stderr'] = serr.read().strip()
        if not self.succeeded() and self.status['stderr']:
          log.error("Task %s failed: stderr was '%s'", self, self.status['stderr'])
        elif self.status['stdout']:
          log.info("Task %s succeeded with message: '%s'", self, self.status['stdout'])

    return self.succeeded()

  def succeeded(self):
    """Return whether the process execution terminated successfully.
    Raises RuntimeError if process wasn't started.
    
    Returns:
    [bool] True iff the process execution terminated successfully."""
    if self.status['returncode'] is None:
      raise RuntimeError("Task '%s'@%s not executed yet.", self)
    return self.status['returncode'] == 0
  
  def failed_retry(self):
    """Return True if failed with a retriable error.
    
    Returns:
    [bool] True iff the process terminated with an exit status > 1."""
    if self.succeeded():
      return False
    return self.status['returncode'] > 1

  def serialize(self):
    """Return a representation of the task suitable for serialization.
    
    The serialized representation includes:
    - task name
    - task identifier
    - command
    - timestamp

    Returns:
    [str] Serialized representation of the task."""
    return json.dumps({
      'ts': self.ts,
      'name': self.name,
      'task_id': str(self.task_id),
      'cmd': self.cmd,
    })
  
  @classmethod
  def from_bytes(cls, b):
    """Build and return a Task from a serialized representation of it.

    See also: serialize().

    Parameters:
    b: [str] Serialized representation of the Task to instantiate.

    Returns:
    [Task] Task object corresponding to the given serialized version."""
    j = json.loads(b)
    rawt = cls('x')
    rawt.ts = j['ts']
    rawt.name = j['name']
    rawt.task_id = j['task_id']
    rawt.cmd = j['cmd']
    return rawt