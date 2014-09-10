Installation Instructions for top100sf-cleaned.patch

Purpose of Patch:

Change the behavior of the 'bigquery-appengine-sample' written in Java
to match the behavior of the 'appengine-bq-join' sample written in
Python.

Installation steps:

1/  check out 'bigquery-appengine-sample' as part of the API client
samples:

hg clone https://code.google.com/p/google-api-java-client.samples/
google-api-client-samples

2/ Follow the instructions to build the original dashboard sample

http://samples.google-api-java-client.googlecode.com/hg/bigquery-appengine-sample/instructions.html

3/ Copy the patch file to the root of your Mercurial repo, one level
above google-api-java-client-samples

cp top100sf-cleaned.patch <my repo root>

4/ Change directory to the BigQuery sample

cd bigquery-appengine-sample

5/ apply the patch using either "patch" or mercurial's built-in
patching mechanism:

hg patch --no-commit -u somebody ../top100sf-cleaned.patch 

6/ Create the author, title, and genre tables from the data in the
python example

http://code.google.com/p/google-bigquery-tools/wiki/PythonAppEngineSample#Getting_the_Data

7/ Edit BigqueryUtils.java to change the table names to make them match
your Dataset and Table names:
   tables.npr_title
   tables.npr_author
   tables.npr_genre

8/ Rebuild

You should now have a Java sample that works the same as the Python
sample, with the addition of asynchronous queries and cached data!

