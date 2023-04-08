import os
import subprocess

ENV_PATH = '/opt/python/current/env'

def patch_environment(path=ENV_PATH):
    "Patch the current environment, os.environ, with the contents of the specified environment file."
    # mostly pulled from a very useful snippet: http://stackoverflow.com/a/3505826/504550
    command = ['bash', '-c', 'source {path} && env'.format(path=path)]

    proc = subprocess.Popen(command, stdout=subprocess.PIPE, universal_newlines=True)
    proc_stdout, _ = proc.communicate(timeout=5)

    # proc_stdout is just a big string, not a file-like object
    # we can't iterate directly over its lines.
    for line in proc_stdout.splitlines():
        (key, _, value) = line.partition("=")
        os.environ[key] = value